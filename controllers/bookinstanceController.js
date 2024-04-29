import asyncHandler from 'express-async-handler';
import BookInstance from '../models/bookinstance.js';

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
    const bookInstance = await BookInstance.findById(id).populate('book').exec();

    if(bookInstance === null) {
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
    res.send('NOT IMPLEMENTED: BookInstance create GET');
});

// Handle BookInstance create on POST.
export const bookinstance_create_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: BookInstance create POST');
});

// Display BookInstance delete form on GET.
export const bookinstance_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
});

// Handle BookInstance delete on POST.
export const bookinstance_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
});

// Display BookInstance update form on GET.
export const bookinstance_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
});

// Handle bookinstance update on POST.
export const bookinstance_update_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
});
