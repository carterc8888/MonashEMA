const mongoose = require('mongoose');

/**
 * @class EventSchema
 * @property {string} eventID - Unique identifier for the event.
 * @property {string} name - Name of the event.
 * @property {Date} startDate - Start date and time of the event.
 * @property {number} duration - Duration of the event in minutes.
 * @property {string} displayDuration - Duration of the event in human-readable format.
 * @property {Date} endDate - End date and time of the event.
 * @property {string} description - Description of the event.
 * @property {boolean} isActive - Indicates whether the event is active.
 * @property {string} image - URL or path to the event's image.
 * @property {number} capacity - Maximum capacity for the event.
 * @property {number} ticketsAvailable - Number of tickets available for the event.
 * @property {mongoose.Schema.Types.ObjectId[]} categoryList - List of category _ids .
 * @property {string[]} categories - List of category ids.
 */

const eventSchema = new mongoose.Schema({
    eventID: String,
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    displayDuration: String,
    endDate: Date,
    description: String,
    isActive: Boolean,
    image: {
        type: String,
        default: ""
    },
    capacity: {
        type: Number,
        min: 10,
        max: 2000,
        default: 1000
    },
    ticketsAvailable: Number,
    categoryList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    categories: [{ type: String, required: true }]
});

/**
 * Pre-save middleware to set the display duration, end date, event ID, and active status of the event.
 * @function
 * @memberof EventSchema
 * @name pre-save
 */
eventSchema.pre('save', function (next) {
    this.displayDuration = convertMinutesToHoursAndMinutes(this.duration);
    this.endDate = new Date(this.startDate.getTime() + this.duration * 60000);
    this.eventID = generateEventID();
    this.isActive = true;
    this.ticketsAvailable === '' ? this.capacity : this.ticketsAvailable; // Check if ticketsAvailable is empty and set capacity accordingly.
    next();
});

/**
 * Generate a unique event ID.
 * @function
 * @returns {string} - A unique event ID.
 */
function generateEventID() {
    let res = '';
    const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let requireCapital = 3;
    for (let i = 0; i < requireCapital; i++) {
        let randomIndex = Math.floor(Math.random() * characterSet.length);
        res += characterSet[randomIndex];
    }
    const requireDigit = 4;
    let randomDigits = Math.round(Math.random() * 10 ** requireDigit);
    res += `-${randomDigits}`;
    return res;
}

/**
 * Convert minutes to hours and minutes format.
 * @function
 * @param {number} minutes - Total minutes to be converted.
 * @returns {string} - Converted time in hours and minutes format.
 */
function convertMinutesToHoursAndMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours + ' hour(s) ' + remainingMinutes + ' minutes';
}

module.exports = mongoose.model('Event', eventSchema);
