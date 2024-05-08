import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Genre from '../models/genre.js';
import Book from '../models/book.js';
import isFirstLetterUpperCaseAndAfterSpace from '../helpers/isUppercase.js';

// Display list of all Genre.
export const genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await Genre.find({}).sort({ name: 1 }).exec();

    res.render('genre_list', {
        title: 'Genre List',
        genre_list: allGenres,
    });
});

// Display detail page for a specific Genre.
export const genre_detail = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Get details of genre and all associated books (in parallel)
    const [genre, booksInGenre] = await Promise.all([
        Genre.findById(id).exec(),
        Book.find({ genre: id }, 'title summary').exec(),
    ]);

    if (genre === null) {
        // No results
        const error = new Error('Genre not found');
        error.status = 404;

        return next(error);
    }

    res.render('genre_detail', {
        genre,
        title: 'Genre Detail',
        genre_books: booksInGenre,
    });
});

// Display Genre create form on GET.
export const genre_create_get = (req, res, next) => {
    res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
export const genre_create_post = [
    // Validate and sanitize the name field.
    body('name')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Genre name must at least 3 characters')
        .custom(isFirstLetterUpperCaseAndAfterSpace)
        .withMessage(
            'The first character of a genre name must be capitalized, as well as the first character after a space or special character'
        )
        .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        const { name } = req.body;
        const genre = new Genre({ name });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('genre_form', {
                genre,
                title: 'Create Genre',
                errors: errors.array(),
            });

            return;
        } else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            const genreExist = await Genre.findOne({ name })
                .collation({ locale: 'en', strength: 2 })
                .exec();

            if (genreExist) {
                // Genre exists, redirect to its detail page.

                res.redirect(genreExist.url);
            } else {
                await genre.save();

                res.redirect(genre.url);
            }
        }
    }),
];

// Display Genre delete form on GET.
export const genre_delete_get = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Get details of genres and all the books that uses it (in parallel)
    const [genre, books] = await Promise.all([
        Genre.findById(id).exec(),
        Book.find({ genre: id }, 'title summary').sort({ title: 1 }).sort(),
    ]);

    if (genre === null) {
        // No results
        res.redirect('catalog/genres');
    }

    res.render('genre_delete', {
        genre,
        books,
        title: 'Delete Genre',
    });
});

// Handle Genre delete on POST.
export const genre_delete_post = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Get details of genre and all their book instances (in parallel)
    const [genre, books] = await Promise.all([
        Genre.findById(id).exec(),
        Book.find({ genre: id }, 'title summary').sort({ title: 1 }).exec(),
    ]);

    if (books.length > 0) {
        // Genre is in use. Render in same way as for GET route.
        res.render('genre_delete', {
            genre,
            books,
            title: 'Delete Genre',
        });
    } else {
        // Genre not in use. Delete object and redirect to the list of genres.
        await Genre.findByIdAndDelete(req.body.genre_id);
        res.redirect('/catalog/genres');
    }
});

// Display Genre update form on GET.
export const genre_update_get = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const genre = await Genre.findById(id).exec();

    if(genre === null) {
        // No results
        const error = new Error('Genre not found');
        error.status = 404;
        return next(error);
    }

    res.render('genre_form', {
        genre,
        title: 'Update Genre'
    });
});

// Handle Genre update on POST.
export const genre_update_post = [
        // Validate and sanitize the name field.
        body('name')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Genre name must at least 3 characters')
        .custom(isFirstLetterUpperCaseAndAfterSpace)
        .withMessage(
            'The first character of a genre name must be capitalized, as well as the first character after a space or special character'
        )
        .escape(),
        // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        const { name } = req.body;
        const genre = new Genre({ name, _id: id });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('genre_form', {
                genre,
                title: 'Create Genre',
                errors: errors.array(),
            });

            return;
        } else {
            // Data from form is valid. Update the record.       
            const updatedGenre = await Genre.findByIdAndUpdate(
                id,
                genre,
                {}
            );    
            
            res.redirect(updatedGenre.url);
        }
    }),
];
