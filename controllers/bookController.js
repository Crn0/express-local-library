import asyncHandler from 'express-async-handler';
import Book from '../models/book.js';

export const index = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Site Home Page');
});

// Display list of all books.
export const book_list = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Book list');
});

// Display detail page for a specific book.
export const book_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
});

// Display book create form on GET.
export const book_create_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Book create GET');
});

// Handle book create on POST.
export const book_create_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Book create POST');
});

// Display book delete form on GET.
export const book_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Book delete GET');
});

// Handle book delete on POST.
export const book_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Book delete POST');
});

// Display book update form on GET.
export const book_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Book update GET');
});

// Handle book update on POST.
export const book_update_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Book update POST');
});
