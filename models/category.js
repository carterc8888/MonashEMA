/**
 * Class that represents a Category
 * @class Category
 */
class Category{
    /**
     * Constructor funcion for Category
     * @constructor
     * @param {string} name - The name of the category
     * @param {string} description - The description of the category
     * @param {string} image - the image path that will be displayed
     */
    constructor(name, description = null, image = null){
        this.name = name;
        this.description = description;
        this.image = image;
        this.id = this.generateId(name);
        this.createdAt = new Date();
    }

    /**
     * Function for generating ID Example: CXX-1234
     * @param {string} name to replace the XX characters of the generated ID
     */
    generateId(name) {
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
    
}

module.exports = Category;
