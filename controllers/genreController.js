import asyncHandler from 'express-async-handler';
import Genre from '../models/genre.js';

// Display list of all Genre.
export const genre_list = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre list');
});

// Display detail page for a specific Genre.
export const genre_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Genre detail: ${req.params.id}`);
});

// Display Genre create form on GET.
export const genre_create_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre create GET');
});

// Handle Genre create on POST.
export const genre_create_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre create POST');
});

// Display Genre delete form on GET.
export const genre_delete_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre delete GET');
});

// Handle Genre delete on POST.
export const genre_delete_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre delete POST');
});

// Display Genre update form on GET.
export const genre_update_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre update GET');
});

// Handle Genre update on POST.
export const genre_update_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Genre update POST');
});
