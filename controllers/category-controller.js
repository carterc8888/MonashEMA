const Category = require("../models/category_schema");
const Counter = require("../models/counter");
const Event = require("../models/event");

/**
 * @module category-controller
 * @description This module contains functions for managing categories, including creation, retrieval, deletion, and updating.
 *
 */
module.exports = {
    /**
     * Functions for creation, retrieval, deletion, and updating
     * @function
     * @param {object} req - The HTTP request object containing the category ID.
     * @param {object} res - The HTTP response object used to send a status message.
     * @returns {Promise<void>} A promise that resolves with a status message after the event is deleted.
     */
    createCategory: async function (req, res) {
        let obj = req.body;
        try {
            let anCategory = await Category.create({
                name: obj.name,
                description: obj.description,
                image: obj.image,
            });
            await Counter.findOneAndUpdate(
                {},
                { $inc: { addCount: 1, categoriesCount: 1 } },
            );
            res.json({categoryID: anCategory.categoryID});
        } catch (err) {
            res.status(500).json({ error: err });
        }
    },
    getAllCategories: async function(req, res){
        try {
            const categories = await Category.find().populate('eventsList');
            res.json(categories);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    },
    deleteCategoryById: async function(req, res){
        try {
            let category = await Category.findOne({ categoryID: req.body.categoryID });

            if (!category) {
                res.json({ status: 'category not found' });
                return;
            }
            await Event.updateMany(
                { _id: { $in: category.eventsList } },
                { $pull: { categoryList: category._id } }
            );

            await Category.deleteOne({ categoryID: category.categoryID });

            await Counter.findOneAndUpdate(
                {},
                { $inc: { deleteCount: 1, categoriesCount: -1} },
            );

            res.json({ acknowledged: true, deletedCount: 1 });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    },
    updateCategoryById: async function(req, res){
        try {
            let obj = req.body;
            const updatedCategory = await Category.findOneAndUpdate(
                { categoryID: obj.categoryID},
                { name: obj.name, description: obj.description },
                { new: true }
            );

            if (!updatedCategory) {
                res.json({ status: 'Category not found' });
                return;
            }
            await Counter.findOneAndUpdate(
                {},
                { $inc: { updateCount: 1} },
            );
            res.json({ status: 'Update successfully' });
        } catch (err) {
            res.status(500).json({ status: 'ID not found'});
        }
    }
}

