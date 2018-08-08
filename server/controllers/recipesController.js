const Recipes = require('../models/recipeModel');
const router = require('express').Router();
const Categories = require('../models/categoryModel');

router.post('/add', (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status("Missing parameters");
    }

    const newRecipe = Recipes({
        name,
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

router.get('/search', (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).send("Missing search parameters");
    }
    Recipes.find({
        $or: [
            {
                name: {
                    $regex: query,
                    $options: "$i"
                }
            },
            {
                description: {
                    $regex: query,
                    $options: "$i"
                }
            }
        ]
    }).sort({ dateCreated: -1 }).exec((err, recipes) => {
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