import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Book from '../models/book.js';
import Author from '../models/author.js';
import Genre from '../models/genre.js';
import BookInstance from '../models/bookinstance.js';


export const index = asyncHandler(async (req, res, next) => {
    const [
        numBooks,
        numBookInstances,
        numAvailableBookInstances,
        numAuthors,
        numGenres,
    ] = await Promise.all([
        Book.countDocuments({}).exec(),
        BookInstance.countDocuments({}).exec(),
        BookInstance.countDocuments({ status: 'Available' }).exec(),
        Author.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
    ]);

    res.render('index', {
        title: 'Local Library Home',
        book_count: numBooks,
        book_instance_count: numBookInstances,
        book_instance_available_count: numAvailableBookInstances,
        author_count: numAuthors,
        genre_count: numGenres,
    });
});

// Display list of all books.
export const book_list = asyncHandler(async (req, res, next) => {
    let allBooks = await Book.find({}, 'title author')
        .sort({ title: 1 })
        .populate('author')
        .exec();

    res.render('book_list', { title: 'Book List', book_list: allBooks });
});

// Display detail page for a specific book.
export const book_detail = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances for specific book
    const { id } = req.params;
    const [book, bookInstances] = await Promise.all([
        Book.findById(id).populate('author').populate('genre').exec(),
        BookInstance.find({ book: id }).exec(),
    ]);

    if (book === null) {
        // No results
        const error = new Error('Book not found');
        error.status = 404;
        return next(error);
    }

    res.render('book_detail', {
        title: book.title,
        book: book,
        book_instances: bookInstances,
    });
});

// Display book create form on GET.
export const book_create_get = asyncHandler(async (req, res, next) => {
    // Get all authors and genres, which we can use for adding to our book.
    const [authors, genres] = await Promise.all([
        Author.find({}).sort({ family_name: 1 }).exec(),
        Genre.find({}).sort({ name: 1 }).exec(),
    ]);

    res.render('book_form', {
        authors,
        genres,
        title: 'Create Book',
    });
});

// Handle book create on POST.
export const book_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if (!Array.isArray(req.body.genre)) {
            req.body.genre = typeof req.body.genre === 'undefined' ? [] : [req.body.genre]
        }

        next();
    },
    // Validate and sanitize fields.
    body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title must not be empty.')
    .escape(),
    body('author')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Author must not be empty.')
    .escape(),
    body('summary')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Summary must not be empty.')
    .escape(),
    body('isbn')
    .trim()
    .isLength({ min: 2 })
    .withMessage('ISBN must not be empty')
    .escape(),
    body('genre.*')
    .escape(),
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre,
        });

        if(!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            let [authors, genres] = await Promise.all([
                Author.find({}).sort({ family_name: 1 }).exec(),
                Genre.find({}).sort({ name: 1 }).exec(),
            ]);

            // Mark our selected genres as checked.
            genres = genres.map((genre) => {
                if(book.genre.includes(genre._id)) {

                    return { ...genre._doc, checked: true };
                }

                return genre;
            });
            
            res.render('book_form', {
                book,
                authors,
                genres,
                title: 'Create Book',
                errors: errors.array(),
            });
        } else {
            // Data from form is valid. Save book.
            await book.save();
            res.redirect(book.url);
        }
    })
];

// Display book delete form on GET.
export const book_delete_get = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Get details of book their genres and author (in parallel)
    const [book, bookInstances] = await Promise.all([
        Book.findById(id).exec(),
        BookInstance.find({ book: id }).exec(),
    ]);

    if(book === null) {
        // No results.
        res.redirect('/catalog/books');
    }

    res.render('book_delete', {
        book, 
        bookInstances,
        title: 'Delete Book',
    });
});

// Handle book delete on POST.
export const book_delete_post = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Get details of book and all their book instances (in parallel)
    const [book, bookInstances] = await Promise.all([
        Book.findById(id).exec(),
        BookInstance.find({ book: id }).exec(),
    ]);

    if(bookInstances.length > 0) {
        // Book has book instances. Render in same way as for GET route.
        res.render('book_delete', {
            book,
            bookInstances,
            title: 'Delete Book',
        })
  
        return;
    } else {
        // Book has no book instances. Delete object and redirect to the list of books.
        await Book.findByIdAndDelete(
            id,
            book,
            {},
        )

        res.redirect('/catalog/books')
    }
    
});

// Display book update form on GET.
export const book_update_get = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Get book, authors and genres for form.
    let [book, authors, genres] = await Promise.all([
        Book.findById(id).populate('author', 'genre').exec(),
        Author.find({}).sort({ family_name: 1 }).exec(),
        Genre.find({}).sort({ name: 1 }).exec(),
    ]);

    if(book === null) {
        // No results
        const error = new Error('Book not found');
        error.status = 404;
        return next(error);
    }

    // Mark our selected genres as checked.
    genres = genres.map((genre) => {
        if(book.genre.includes(genre._id)) {
            
            return { ...genre._doc, checked: true };
        }

        return genre;
    });

    res.render('book_form', {
        book,
        authors,
        genres,
        title: 'Update Book'
    });
});

// Handle book update on POST.
export const book_update_post = [
    // Convert the genre to an array
    (req, res, next) => {
        if(!Array.isArray(req.body.genre)) {
            req.body.genre = typeof req.body.genre === "undefined" ? [] : [req.body.genre];
        }

        next();
    },

    // Validate and sanitize fields.
    body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title must not be empty.')
    .escape(),
    body('author')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Author must not be empty.')
    .escape(),
    body('summary')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Summary must not be empty.')
    .escape(),
    body('isbn')
    .trim()
    .isLength({ min: 1 })
    .withMessage('ISBN must not be empty')
    .escape(),
    body('genre')
    .escape(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre,
            _id: req.params.id, // This is required, or a new ID will be assigned!
        });

        if(!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form
            let [authors, genres] = await Promise.all([
                Author.find({}).sort({ family_name: 1 }).exec(),
                Genre.find({}).sort({ name: 1 }).exec(),
            ]);

            // Mark our selected genres as checked.
            genres = genres.map((genre) => {
                if(book.genre.includes(genre._id)) {
                    
                    return {...genre._doc, checked: true };
                }

                return genre;
            });

            res.render("book_form", {
                book,
                authors,
                genres,
                title: "Update Book",
                errors: errors.array(),
              });

            return;
        } else {
            // Data from form is valid. Update the record.
            const updatedBook = await Book.findByIdAndUpdate(req.params.id, book, {});
            // Redirect to book detail page.
            res.redirect(updatedBook.url);
        }
    }),
];
