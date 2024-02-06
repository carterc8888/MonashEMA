const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category-controller');
const path = require('path');
const Event = require("../models/event");
const Category = require("../models/category_schema");
const Counter = require("../models/counter");
const VIEWS_PATH = path.join(__dirname, '../views/category/');
/**
 * Middleware to parse URL-encoded request bodies.
 * @name express.urlencoded
 * @function
 * @memberof router
 */
router.use(express.urlencoded({extended:true}));

/**
 * Route to create a new category.
 * @name POST /api/v1/category/32418361/add
 * @function
 * @memberof router
 * @param {function} categoryController.createCategory - Controller function to handle category creation.
 */
router.post('/api/v1/category/32418361/add', categoryController.createCategory);

/**
 * Route to get all categories.
 * @name GET /api/v1/category/32418361/list
 * @function
 * @memberof router
 * @param {function} categoryController.getAllCategories - Controller function to handle retrieving all categories.
 */
router.get('/api/v1/category/32418361/list', categoryController.getAllCategories);

/**
 * Route to delete an category by ID.
 * @name DELETE /api/v1/category/32418361/delete
 * @function
 * @memberof router
 * @param {function} categoryController.deleteCategoryById - Controller function to handle category deletion by ID.
 */
router.delete('/api/v1/category/32418361/delete', categoryController.deleteCategoryById);

/**
 * Route to update an category by ID.
 * @name PUT /api/v1/category/32418361/update
 * @function
 * @memberof router
 * @param {function} categoryController.updateCategoryById - Controller function to handle category update by ID.
 */
router.put('/api/v1/category/32418361/update', categoryController.updateCategoryById);

/*************************************************Below are A1 APIs*********************************************************/
/**
 * Add Category eg.http://localhost:8080/category/32418361/add
 * @name GET /category/32418361/add
 * @function
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
router.get('/category/32418361/add', function(req,res){
    res.sendFile(VIEWS_PATH + 'addCategory.html');
});

/**
 * Request when category is added eg.http://localhost:8080/category/32418361/listall
 * @name POST /category/32418361/listall
 * @function
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
router.get('/category/32418361/listall', async function (req, res){
    const categories = await Category.find({});
    res.render(VIEWS_PATH + "listAllCategory.html", {categories: categories})
});

/**
 * Route to handle category creation.
 * @name POST /category/32418361/add
 * @function
 * @memberof router
 * @param {function} categoryController.createCategory - Controller function to handle category creation.
 */
router.post('/category/32418361/add', async function (req, res){
    let obj = req.body;
    await Category.create({
        name: obj.name,
        description: obj.description,
        image: obj.image,
    });
    await Counter.findOneAndUpdate(
        {},
        { $inc: { addCount: 1, categoriesCount: 1 } },
    );
    res.redirect("/category/32418361/listall");
})

/**
 * Filter Category by keyword eg.http://localhost:8080/category/32418361/search-category?keyword=default
 * @name GET /32418361/search-category
 * @function
 * @param {object} req - Express request object with the "keyword" query parameter.
 * @param {object} res - Express response object.
 */
router.get('/category/32418361/search-category', async function(req, res) {
    // Retrieve the "keyword" query parameter from req.query
    const keyword = req.query.keyword;
    const categories = await Category.find({});
    res.render(VIEWS_PATH + "filterCategory.html", {
        categories: categories,
        keyword : keyword
    });
});

/**
 * Route to category an event by ID.
 * @name GET /category/32418361/delete-category
 * @function
 * @memberof router
 */
router.get('/category/32418361/delete-category', function (req, res){
    res.sendFile(VIEWS_PATH + 'deleteCategory.html');
});


/**
 * Route to handle category deletion.
 * @name POST /category/32418361/delete-category
 * @function
 * @memberof router
 * @param {function} categoryController.deleteCategoryById - Controller function to handle category creation.
 */
router.post('/category/32418361/delete-category', async function(req,res){
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
    res.redirect("/category/32418361/listall");
})


module.exports = router;