import asyncHandler from 'express-async-handler';
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
