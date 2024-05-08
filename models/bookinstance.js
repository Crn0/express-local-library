import mongoose from 'mongoose';
import { DateTime } from 'luxon';

const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
    // reference to the associated book
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    imprint: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
        default: 'Maintenance',
    },
    due_back: { type: Date, default: Date.now },
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual('url').get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/catalog/bookinstance/${this._id}`;
});

// Virtual for borrowed books due date.
BookInstanceSchema.virtual('due_back_formatted').get(function () {
    // const options = {
    //     weekday: 'short',
    //     year: 'numeric',
    //     month: 'short',
    //     day: 'numeric',
    // };

    // Date formatter implementation
    // return this.due_back.toLocaleDateString([], options).split(' ').slice(1).join(' ');

    return this.due_back
        ? DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED)
        : 'N/A';
});

// Virtual for due back date for input date
BookInstanceSchema.virtual('due_back_yyyy_mm_dd').get(function () {
    return DateTime.fromJSDate(this.due_back).toISODate(); // format 'YYYY-MM-DD'
});

export default mongoose.model('BookInstance', BookInstanceSchema);
