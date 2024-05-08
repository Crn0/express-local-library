import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import BookInstance from '../models/bookinstance.js';
import Book from '../models/book.js';
import status from '../data/status.js';
import checkForNumAndString from '../helpers/numAndString.js';

export const bookinstance_list = asyncHandler(async (req, res, next) => {
    const allBookInstances = await BookInstance.find({})
        .populate('book')
        .exec();

    res.render('bookinstance_list', {
        title: 'Book Instance list',
        bookinstance_list: allBookInstances,
    });
});

// Display detail page for a specific BookInstance.
export const bookinstance_detail = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const bookInstance = await BookInstance.findById(id)
        .populate('book')
        .exec();

    if (bookInstance === null) {
        // No results
        const error = new Error('Book copy not found');
        error.status = 404;
        return next(error);
    }

    res.render('bookinstance_detail', {
        bookInstance,
        title: 'Book',
    });
});

// Display BookInstance create form on GET.
export const bookinstance_create_get = asyncHandler(async (req, res, next) => {
    const book_list = await Book.find({}, 'title').sort({ title: 1 }).exec();
    const options = structuredClone(status);

    res.render('bookinstance_form', {
        book_list,
        options,
        title: 'Create Form',
    });
});

// Handle BookInstance create on POST.
export const bookinstance_create_post = [
    // Validate and sanitize fields.
    body('book')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Book must be specified')
        .escape(),
    body('imprint')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Imprint must be specified')
        .custom(checkForNumAndString)
        .withMessage('There must be a publisher name and date')
        .escape(),
    body('status').escape(),
    body('due_back').optional({ values: 'falsy' }).isISO8601().toDate(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        const bookInstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
        });

        if (!errors.isEmpty()) {
            // There are errors.
            // Render form again with sanitized values and error messages.
            const book_list = await Book.find({}, 'title')
                .sort({ title: 1 })
                .exec();
            // array of an object of status
            let options = structuredClone(status);

            options = options.map((option) => {
                if (option.status === bookInstance.status) {
                    return { ...option, selected: true };
                }

                return option;
            });

            res.render('bookinstance_form', {
                book_list,
                bookInstance,
                options,
                title: 'Create BookInstance',
                selected_book: bookInstance.book._id,
                errors: errors.array(),
            });
        } else {
            // Data from form is valid
            await bookInstance.save();
            res.redirect(bookInstance.url);
        }
    }),
];

// Display BookInstance delete form on GET.
export const bookinstance_delete_get = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Get the detail of the book instance
    const bookInstance = await BookInstance.findById(id)
        .populate('book')
        .exec();

    if (bookInstance === null) {
        // No results
        res.redirect('/catalog/bookinstances');
    }
    console.log(bookInstance);
    res.render('bookinstance_delete', {
        bookInstance,
        title: 'Delete Book Instance',
    });
});

// Handle BookInstance delete on POST.
export const bookinstance_delete_post = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Delete book instance and redirect to the list of book instances
    await BookInstance.findByIdAndDelete(id);
    res.redirect('/catalog/bookinstances');
});

// Display BookInstance update form on GET.
export const bookinstance_update_get = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Get genre and books for form.
    console.log(id)
    const [bookInstance, book_list] = await Promise.all([
        BookInstance.findById(id).populate('book').exec(),
        Book.find({}, 'title').exec(),
    ]);

    if (bookInstance === null) {
        const error = new Error('Book Instance not found');
        error.status = 404;
        return next(error);
    }

    let options = structuredClone(status);

    options = options.map((option) => {
        if (option.status === bookInstance.status) {
            return { ...option, selected: true };
        }

        return option;
    });

    res.render('bookinstance_form', {
        bookInstance,
        book_list,
        options,
        selected_book: bookInstance.book._id,
        title: 'Update Book Instance',
    });
});

// Handle bookinstance update on POST.
export const bookinstance_update_post = [
    // Validate and sanitize fields.
    body('book')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Book must be specified')
        .escape(),
    body('imprint')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Imprint must be specified')
        .custom(checkForNumAndString)
        .withMessage('There must be a publisher name and date')
        .escape(),
    body('status').escape(),
    body('due_back').optional({ values: 'falsy' }).isISO8601().toDate(),

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        const bookInstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
            _id: id, // This is required, or a new ID will be assigned!
        });

        if (!errors.isEmpty()) {
            // There are errors.
            // Render form again with sanitized values and error messages.
            const book_list = await Book.find({}, 'title')
                .sort({ title: 1 })
                .exec();
            // array of an object of status
            let options = structuredClone(status);

            options = options.map((option) => {
                if (option.status === bookInstance.status) {
                    return { ...option, selected: true };
                }

                return option;
            });

            res.render('bookinstance_form', {
                book_list,
                bookInstance,
                options,
                title: 'Create BookInstance',
                selected_book: bookInstance.book._id,
                errors: errors.array(),
            });
        } else {
            // Data from form is valid. Update the record.
            const updatedBookInstance = await BookInstance.findByIdAndUpdate(
                id,
                bookInstance,
                {}
            );
            res.redirect(updatedBookInstance.url);
        }
    }),
];
