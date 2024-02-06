const mongoose = require("mongoose");

/**
 * Generate a unique category ID.
 * @function
 * @param {string} - CXX where XX is replaced by the first 2 characters of name
 * @returns {string} - A category event ID.
 */
function generateId(name) {
    if (!name || name.length < 2) {
        name = "XX";
    }

    let output = "C" + name.substring(0, 2).toUpperCase() + "-";

    // generate random number between min and max
    const min = 0;
    const max = 9999;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    const randomNumString = String(randomNum).padStart(4, '0');

    return output + randomNumString;
}

/**
 * @typedef {Object} CategoryDocument
 * @property {string} categoryID - Unique identifier for the category.
 * @property {string} name - Name of the category.
 * @property {Date} createdAt - Date of the category created.
 * @property {string} description - Description of the category.
 * @property {string} image - URL or path to the category's image.
 * @property {mongoose.Schema.Types.ObjectId[]} eventsList - List of event _ids .
 */

const categorySchema = new mongoose.Schema({
    categoryID: {
        type: String,
        default: function() {
            return generateId(this.name);
        }
    },
    eventsList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        },
    ],
    name: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // Use a regular expression to check for alphanumeric values
                return /^[a-zA-Z0-9]+$/.test(value);
            },
            message: "Name must contain only alphanumeric characters."
        }
    },
    description: String,
    image: {
        type:String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Category", categorySchema);
