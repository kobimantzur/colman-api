const Recipes = require('../models/recipeModel');
const router = require('express').Router();


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

module.exports = router;