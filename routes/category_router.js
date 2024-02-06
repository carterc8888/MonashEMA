/**
 * this is the router for category add/show/delete, etc
 */

/**
 * Express module for creating the router.
 * @const
 */
const express = require('express');

/**
 * Path module for working with file and directory paths.
 * @const
 */
const path = require('path');

/**
 * Express router for handling category routes.
 * @const
 */
const router = express.Router();

/**
 * Category model for managing category data.
 * @const
 */
const Category = require('../models/category');

/**
 * Middleware to parse incoming form data.
 */
router.use(express.urlencoded({extended:true}));
router.use('/category/32418361', express.static(path.join(__dirname, '../images')));

/**
 * Database to store category data.
 * @const
 * @type {Array<Category>}
 */
const categoryDatabase = [];

/**
 * Path to the directory containing category views.
 * @const
 */
const VIEWS_PATH = path.join(__dirname, '../views/category/');


// router.post('/category/32418361/add', function (req, res){
//     // Extract data from request body
//     let reqBody = req.body;
//     console.log(reqBody)

//     // Create a new Category instance with provided data
//     let newCategory = new EventClass(reqBody.name, reqBody.description, reqBody.image);
//     newCategory.description = reqBody.description;
//     newCategory.image = reqBody.image || newCategory.image;
//     newCategory.name = reqBody.name;

//     // Add the new Category to the Category database
//     categoryDatabase.push(newCategory);

//     // Redirect to the list of all events
//     res.redirect("/category/32418361/listall");
// });

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
router.post('/category/32418361/listall', async function (req, res){
    const categories = await Category.find({});
    res.render("")
});

/**
 * List All Categories eg.http://localhost:8080/category/32418361/listall
 * @name GET /category/32418361/listall
 * @function
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
router.get('/category/32418361/listall', function (req, res) {
    res.render("category/listAllCategory", {categories: categoryDatabase});
    // send all category details to client
})

/**
 * Delete Category by id eg.http://localhost:8080/category/32418361/delete-category
 * @name GET /category/32418361/delete-category
 * @function
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
router.get('/category/32418361/delete-category', function (req, res){
    res.sendFile(VIEWS_PATH + 'deleteCategory.html');
})

/**
 * Request when a category is deleted eg.http://localhost:8080/category/32418361/delete-category
 * @name GET /category/32418361/delete-category
 * @function
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
router.post('/category/32418361/delete-category', function(req,res){
    let categoryID = req.body.categoryId;
    for (let i=0; i<categoryDatabase.length; i++){
        if(categoryDatabase[i].id === categoryID){
            categoryDatabase.splice(i,1); 
            break;
        }
    }
    console.log(categoryDatabase);
    console.log(categoryID);
    res.redirect("/category/32418361/listall");
})

/**
 * Filter Category by keyword eg.http://localhost:8080/32418361/search-category?keyword=default
 * @name GET /32418361/search-category
 * @function
 * @param {object} req - Express request object with the "keyword" query parameter.
 * @param {object} res - Express response object.
 */
router.get('/32418361/search-category', function(req, res) {
    // Retrieve the "keyword" query parameter from req.query
    const keyword = req.query.keyword;
    res.render("category/filterCategory.html", {
        categories: categoryDatabase,
        keyword : keyword
    });
});

// module.exports = router;
//the category database is needed for Task2.4
exports.router = router;
exports.categoryDatabase = categoryDatabase;