const mongoose = require('mongoose');

/**
 * @class CounterSchema
 * @property {number} eventsCount - The count of events in the database.
 * @property {number} categoriesCount - The count of categories in the database.
 * @property {number} addCount - The count of added entities.
 * @property {number} updateCount - The count of updated entities.
 * @property {number} deleteCount - The count of deleted entities.
 */
const CounterSchema = new mongoose.Schema({
    eventsCount: {
        type: Number,
        default: 0,
    },
    categoriesCount: {
        type: Number,
        default: 0,
    },
    addCount: {
        type: Number,
        default: 0,
    },
    updateCount: {
        type: Number,
        default: 0,
    },
    deleteCount: {
        type: Number,
        default: 0,
    },
});


const Counter = mongoose.model('Counter', CounterSchema);

module.exports =  Counter;
