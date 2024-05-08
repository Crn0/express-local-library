import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Author from '../models/author.js';
import Book from '../models/book.js';
import isFirstLetterUpperCaseAndAfterSpace from '../helpers/isUppercase.js';
// import formatName from '../helpers/toUpperCase.js';

// Display list of all Authors.
export const author_list = asyncHandler(async (req, res, next) => {
    const allAuthors = await Author.find({}).sort({ family_name: 1 }).exec();

    res.render('author_list', {
        title: 'Author list',
        author_list: allAuthors,
    });
});

// Display detail page for specific Author.
export const author_detail = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //  Get details of author and all their books (in parallel)
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(id).exec(),
        Book.find({ author: id }, 'title summary').exec(),
    ]);

    if (author === null) {
        // No results
        const error = new Error('Author not found');
        error.status = 404;
        return next(error);
    }

    res.render('author_detail', {
        author,
        title: 'Author Detail',
        author_books: allBooksByAuthor,
    });
});

// Display Author create form on GET.
export const author_create_get = asyncHandler(async (req, res, next) => {
    res.render('author_form', { title: 'Create Author' });
});

// Display Author create on POST.
export const author_create_post = [
    // Validate and sanitize fields
    body('first_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified.')
        .custom(isFirstLetterUpperCaseAndAfterSpace)
        .withMessage(
            'The first character of a first name must be capitalized, as well as the first character after a space or special character'
        ),
    body('family_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified.')
        .custom(isFirstLetterUpperCaseAndAfterSpace)
        .withMessage(
            'The first character of a family name must be capitalized, as well as the first character after a space or special character'
        ),
    body('date_of_birth')
        .optional({ values: 'falsy' })
        .isISO8601()
        .withMessage('Invalid date of birth')
        .toDate(),
    body('date_of_death')
        .optional({ values: 'falsy' })
        .isISO8601()
        .withMessage('Invalid date of birth')
        .toDate(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Author object with escaped and trimmed data
        const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
            _id: id,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_form', {
                author,
                title: 'Create Author',
                errors: errors.array(),
            });

            return;
        } else {
            // Data from form is valid. Update the record.
            const updatedAuthor = await Author.findByIdAndUpdate(
                id,
                author,
                {}
            );
            // Redirect to new author record.
            res.redirect(author.url);
        }
    }),
];

// Display Author delete form on GET.
export const author_delete_get = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Get details of author and all their books (in parallel)
    const [author, author_books] = await Promise.all([
        Author.findById(id).exec(),
        Book.find({ author: id }, 'title summary').exec(),
    ]);

    if (author === null) {
        // No results.
        res.redirect('/catalog/authors');
    }

    res.render('author_delete', {
        author,
        author_books,
        title: 'Delete Author',
    });
});

// Handle Author delete on POST.
export const author_delete_post = asyncHandler(async (req, res, next) => {
    // author id
    const { id } = req.params;
    // Get details of author and all their books (in parallel)
    const [author, author_books] = await Promise.all([
        Author.findById(id).exec(),
        Book.find({ author: id }, 'title summary').exec(),
    ]);

    if (author_books.length > 0) {
        // Author has books. Render in same way as for GET route.
        res.render('author_delete', {
            author,
            author_books,
            title: 'Delete Author',
        });
        console.log(42);

        return;
    } else {
        // Author has no books. Delete object and redirect to the list of authors.
        await Author.findByIdAndDelete(req.body.author_id);
        res.redirect('/catalog/authors');
    }
});
// Display Author update form on GET.
export const author_update_get = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //  Get details of author and all their books (in parallel)
    const author = await Author.findById(id).exec()

    if (author === null) {
        // No results
        const error = new Error('Author not found');
        error.status = 404;
        return next(error);
    }

    res.render('author_form', {
        author,
        title: 'Create Author',
    });
});

// Handle Author update on POST>
export const author_update_post = [
    // Validate and sanitize fields
    body('first_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified.')
        .custom(isFirstLetterUpperCaseAndAfterSpace)
        .withMessage(
            'The first character of a first name must be capitalized, as well as the first character after a space or special character'
        ),
    body('family_name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified.')
        .custom(isFirstLetterUpperCaseAndAfterSpace)
        .withMessage(
            'The first character of a family name must be capitalized, as well as the first character after a space or special character'
        ),
    body('date_of_birth')
        .optional({ values: 'falsy' })
        .isISO8601()
        .withMessage('Invalid date of birth')
        .toDate(),
    body('date_of_death')
        .optional({ values: 'falsy' })
        .isISO8601()
        .withMessage('Invalid date of birth')
        .toDate(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Author object with escaped and trimmed data
        const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
            _id: id,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_form', {
                author,
                title: 'Create Author',
                errors: errors.array(),
            });

            return;
        } else {
            // Data from form is valid.

            // Save the author
            const updatedAuthor = await Author.findByIdAndUpdate(
                id,
                author,
                {}
            );
            // Redirect to new author record.
            res.redirect(updatedAuthor.url);
        }
    }),
]