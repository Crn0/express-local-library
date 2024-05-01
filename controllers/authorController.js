import asyncHandler from 'express-async-handler';
import Author from '../models/author.js';
import Book from '../models/book.js';

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
