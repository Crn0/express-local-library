import mongoose from 'mongoose';
import { DateTime } from 'luxon';

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLength: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual('name').get(function () {
    // To avoid errors in cases where an author does not have either a family name or first name
    // We want to make sure we handle the exception by returning an empty string for that case
    let fullName = '';

    if (this.first_name && this.family_name) {
        fullName = `${this.family_name}, ${this.first_name}`;
    }

    return fullName;
});

// Virtual for author's URL
AuthorSchema.virtual('url').get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/catalog/author/${this._id}`;
});

// Virtual date formatter for author's birth date
AuthorSchema.virtual('birth_date_formatted').get(function () {
    if (this.date_of_birth)
        return DateTime.fromJSDate(this.date_of_birth).toLocaleString(
            DateTime.DATE_MED
        );

    return '';
    // if date of birth exist return it else return string
    // return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
});

// Virtual date formatter for author's death date
AuthorSchema.virtual('death_date_formatted').get(function () {
    if (this.date_of_death)
        return DateTime.fromJSDate(this.date_of_death).toLocaleString(
            DateTime.DATE_MED
        );

    return '';
    // if date of death exist return it else return string
    // return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : '';
});

// Virtual date for birth and death of author
AuthorSchema.virtual('lifespan').get(function () {
    let birth = '';
    let death = '';

    if (this.date_of_birth) {
        birth = DateTime.fromJSDate(this.date_of_birth).toLocaleString(
            DateTime.DATE_MED
        );
    }

    if (this.date_of_death) {
        death = DateTime.fromJSDate(this.date_of_death).toLocaleString(
            DateTime.DATE_MED
        );
    }

    return `${birth} - ${death}`;
});

// Virtual for author's birth date for input date
AuthorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function () {
    return DateTime.fromJSDate(this.date_of_birth).toISODate(); // format 'YYYY-MM-DD'
});
// Virtual for author's death date for input date
AuthorSchema.virtual('date_of_death_yyyy_mm_dd').get(function () {
    return DateTime.fromJSDate(this.date_of_death).toISODate(); // format 'YYYY-MM-DD'
});

export default mongoose.model('Author', AuthorSchema);
