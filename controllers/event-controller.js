/**
 * @module event-controller
 * @description This module contains functions for managing events, including creation, retrieval, deletion, and updating.
 *
 */
const Event = require("../models/event");
const Category = require("../models/category_schema");
const Counter = require("../models/counter");

/**
 * Create an event
 * @function
 * @param {object} req - The HTTP request object containing event data.
 * @param {object} res - The HTTP response object used to send a response.
 * @returns {Promise<void>} A promise that resolves when the event is successfully created.
 */
async function createEvent(req, res) {
    // Extract event data from the request.
    let obj = req.body;

    // Parse category IDs from the 'categories' field.
    let categoryIds = [];
    for (let i = 0; i < obj.categories.length; i++) {
        if (obj.categories[i] === ',') {
            categoryIds = obj.categories.split(',');
            break;
        }
    }

    // If categoryIds is still an empty array, add the single category.
    categoryIds === [] ? categoryIds.push(obj.categories) : categoryIds;
    let categories = await Category.find({categoryID: { $in: categoryIds }});

    try {
        // Create a new event in the database.
        let anEvent = await Event.create({
            name: obj.name,
            description: obj.description,
            categories: categoryIds,
            categoryList: categories.map(category => category._id), // Store the category IDs (not the category objects
            startDate: obj.startDateTime,
            duration: obj.durationInMinutes,
            image: obj.image,
            capacity: obj.capacity,
            ticketsAvailable: obj.ticketsAvailable,
            isActive: obj.isActive
        });
        // Update associated categories with this event.
        await Category.updateMany(
            { categoryID: { $in: categoryIds } },
            { $push: { eventsList: anEvent._id } }
        );

        // Increment the event counter.
        await Counter.findOneAndUpdate(
            {},
            { $inc: { addCount: 1, eventsCount: 1 } },
        );

        // Respond with the newly created event's ID.
        res.json({ eventId: anEvent.eventID });
    } catch (err) {
        // Handle errors and send an error response.
        res.status(500).json({ error: err });
    }
}

/**
 * Get all events in the database
 * @function
 * @param {object} req - The HTTP request object (not used in this function).
 * @param {object} res - The HTTP response object used to send a list of events.
 * @returns {Promise<void>} A promise that resolves with the list of events.
 */
async function getAllEvents(req, res) {
    try {
        // Retrieve all events from the database and populate their categories.
        const events = await Event.find().populate('categoryList');

        // Respond with the list of events.
        res.json(events);
    } catch (err) {
        // Handle errors and send an error response.
        res.status(500).json({ error: err });
    }
}

/**
 * Delete event by event ID
 * @function
 * @param {object} req - The HTTP request object containing the event ID to delete.
 * @param {object} res - The HTTP response object used to send a status message.
 * @returns {Promise<void>} A promise that resolves with a status message after the event is deleted.
 */
async function deleteEventById(req, res) {
    try {
        // Find the event to delete by event ID.
        let event = await Event.findOne({ eventID: req.body.eventId });

        if (!event) {
            // If the event is not found, send a status message.
            res.json({ status: 'Event not found' });
            return;
        }

        // Update associated categories to remove the event reference.
        await Category.updateMany(
            { _id: { $in: event.categoryList } },
            { $pull: { eventsList: event._id } }
        );

        // Delete the event from the database.
        await Event.deleteOne({ eventID: event.eventID });

        // Decrement the event counter.
        await Counter.findOneAndUpdate(
            {},
            { $inc: { deleteCount: 1, eventsCount: -1 } },
        );

        // Respond with a status message indicating successful deletion.
        res.json({ acknowledged: true, deletedCount: 1 });
    } catch (err) {
        // Handle errors and send an error response.
        res.status(500).json({ error: err });
    }
}

/**
 * Update event by event ID
 * @function
 * @param {object} req - The HTTP request object containing updated event data and event ID.
 * @param {object} res - The HTTP response object used to send a status message.
 * @returns {Promise<void>} A promise that resolves with a status message after the event is updated.
 */
async function updateEventById(req, res) {
    try {
        // Extract updated event data and event ID from the request.
        let obj = req.body;

        // Find and update the event by event ID.
        const updatedEvent = await Event.findOneAndUpdate(
            { eventID: obj.eventId },
            { name: obj.name, capacity: obj.capacity },
            { new: true }
        );

        if (!updatedEvent) {
            // If the event is not found, send a status message.
            res.json({ status: 'Event not found' });
            return;
        }

        // Increment the update counter.
        await Counter.findOneAndUpdate(
            {},
            { $inc: { updateCount: 1 } },
        );

        // Respond with a status message indicating successful update.
        res.json({ status: 'Update successfully' });
    } catch (err) {
        // Handle errors and send an error response.
        res.status(500).json({ error: err });
    }
}

// Export the functions for use in other modules.
module.exports = {
    createEvent,
    getAllEvents,
    deleteEventById,
    updateEventById
};
