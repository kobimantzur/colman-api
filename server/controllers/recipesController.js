const Recipes = require('../models/recipeModel');
const router = require('express').Router();
const Categories = require('../models/categoryModel');

router.post('/add', (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status("Missing parameters");
    }

    const newRecipe = Recipes({
        title,
        description,
    });

    newRecipe.save((err, recipeObj) => {
        if (err || !recipeObj) {
            return res.status(400).send("Error creating a new recipe");
        }
        return res.status(200).send(recipeObj);
    })
});

router.get('/getAll', (req, res) => {
    Recipes.find({}, (err, recipes) => {
        if (err || !recipes) {
            return res.status(400).send("error rerieving recipes");
        }
        return res.status(200).send(recipes);
    });
});

router.get('/getCategories', (req, res) => {
    Categories.find({}, (err, categories) => {
        if (err || !categories) {
            return res.status(400).send("error");
        }
        return res.status(200).send(categories);
    })

})

module.exports = router;