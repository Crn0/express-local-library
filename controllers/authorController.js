import asyncHandler from 'express-async-handler';
import Author from '../models/author.js';

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
    res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`);
});

// Display Author create form on GET.
export const author_create_get = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Author create GET');
});

// Display Author create on POST.
export const author_create_post = asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Author create GET');
});

// Display Author delete form on GET.
export const author_delete_get = asyncHandler(async (res, req, next) => {
    res.send('NOT IMPLEMENTED: Author delete GET');
});

// Handle Author delete on POST.
export const author_delete_post = asyncHandler(async (res, req, next) => {
    res.send('NOT IMPLEMENTED: Author delete POST');
});

// Display Author update form on GET.
export const author_update_get = asyncHandler(async (res, req, next) => {
    res.send('NOT IMPLEMENTED: Author update GET');
});

// Handle Author update on POST>
export const author_update_post = asyncHandler(async (res, req, next) => {
    res.send('NOT IMPLEMENTED: Author update post');
});
