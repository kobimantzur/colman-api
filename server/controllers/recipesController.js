const Recipes = require("../models/recipeModel");
const router = require("express").Router();
const Categories = require("../models/categoryModel");
const app = require('../../app');
router.post('/edit', (req, res) => {
  const {
    _id,
    name,
    description,
    imagePath,
    latitude,
    longitude,
    categoryId,
    address
  } = req.body;

  if (!_id) {
    return res.status(400).send("missing params");
  }

  Recipes.findByIdAndUpdate(_id, {
    name,
    description,
    imagePath,
    latitude,
    longitude,
    categoryId,
    address
  }, (err, result) => {
    if (err) {
      return res.status(400).send(err);
    }

    return res.status(200).send("success");
  })
})

router.post("/add", (req, res) => {
  const {
    name,
    description,
    imagePath,
    latitude,
    longitude,
    address,
    categoryId
  } = req.body;
  if (!name || !description) {
    return res.status(400).send("Missing parameters");
  }

  const newRecipe = Recipes({
    name,
    description,
    imagePath: imagePath || "",
    latitude,
    longitude,
    address,
    categoryId
  });

  newRecipe.save((err, recipeObj) => {
    if (err || !recipeObj) {
      return res.status(400).send(err);
    }
    let socket = app.get('ioSocket')
    socket.emit('recipeAdded')
    return res.status(200).send(recipeObj);
  });
});

router.post("/delete", (req, res) => {
  const { recipeId } = req.body;
  if (!recipeId) return res.status(400).send("missing params");
  Recipes.find({ _id: recipeId }).remove((err, recipes) => {
    if (err || !recipes) {
      return res.status(400).send("error rerieving recipes");
    }
    return res.status(200).send(recipes[0]);
  });
});

router.get("/getRecipeById", (req, res) => {
  const { recipeId } = req.query;
  if (!recipeId) return res.status(400).send("missing params");
  Recipes.find({ _id: recipeId }, (err, recipes) => {
    if (err || !recipes) {
      return res.status(400).send("error rerieving recipes");
    }
    return res.status(200).send(recipes[0]);
  });
});

router.get("/getAll", (req, res) => {
  Recipes.find({}, (err, recipes) => {
    if (err || !recipes) {
      return res.status(400).send("error rerieving recipes");
    }
    return res.status(200).send(recipes);
  });
});

router.get("/search", (req, res) => {
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
  })
    .sort({ dateCreated: -1 })
    .exec((err, recipes) => {
      if (err || !recipes) {
        return res.status(400).send("error rerieving recipes");
      }
      return res.status(200).send(recipes);
    });
});

router.get("/getCategories", (req, res) => {
  Categories.find({}, (err, categories) => {
    if (err || !categories) {
      return res.status(400).send("error");
    }
    return res.status(200).send(categories);
  });
});

module.exports = router;
