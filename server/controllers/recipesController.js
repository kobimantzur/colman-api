const Recipes = require("../models/recipeModel");
const router = require("express").Router();
const Categories = require("../models/categoryModel");
const app = require('../../app');

router.get('/getGroupedCategories', (req, res) => {
  const aggregatorOpts = [
    {
      $group: {
        _id: "$categoryId",
        count: { $sum: 1 }
      }
    }
  ]

  Recipes.aggregate(aggregatorOpts).exec((err, result) => {
    return res.status(200).send(result);
  })
});

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



// User like's Recipe
router.post("/like", (req, res) => {
  const {
    email,
    categoryId
  } = req.body;
  if (!email || !categoryId) {
    return res.status(400).send("Missing parameters");
  }

  Users.find({ email: email })
    .exec((err, user) => {
      if (err || !user || user.length == 0) {
        return res.status(400).send("error rerieving user");
      } else if (user.likedRecipes && user.likedRecipes.length == 3) {
        return res.status(400).send("Too many likes");
      }
      const currentUser = user[0];
      console.log(currentUser)
      currentUser.likedCategories.push(categoryId)
      currentUser.save((err) => {
        if (err) return res.status(400).send("error saving user");
        //like is saved, continue to SVM
        vectorToPredict = [0, 0, 0];
        // Pre-process features and create vector to predict
        for (let category of categories) {
          if (category == "5b6b069568ee0ce626c8f6dc") { // Italian
            vectorToPredict[0] += 1;
          }
          else if (category == "5b6b078bc6ec62e67da5b5be") { // Israeli
            vectorToPredict[1] += 1;
          } else {
            vectorToPredict[2] += 1;
          }
        }
        // Load training set
        var lineReader = require('readline').createInterface({
          input: require('fs').createReadStream('../resources/svmTraining.txt')
        });

        var svmTraining = []
        lineReader.on('line', function (line) {
          values = line.split(',')
          valuesY = values[3];
          valuesXlist = [values[0], values[1], values[2]]
          svmTraining = [valuesXlist, valuesY];
        });
        // Initialize a new predictor
        var clf = new svm.CSVC();
        clf.train(svmTraining).done(function () {
          // Predict user's 'liked' kitchen based on 'liked' recipes
          var prediction = clf.predictSync(vectorToPredict);
          // TODO: Send prediction result to database
          if (prediction == -1) {
            Users.update({ predictedCategory: "5b6b069568ee0ce626c8f6dc" }); // Italian
          } else if (prediction == 0) {
            Users.update({ predictedCategory: "5b6b078bc6ec62e67da5b5be" }); // Israeli
          } else {
            Users.update({ predictedCategory: "5b6b06c21c1b56e63bc33619" }); // American
          }
        });
      });
    })

});

module.exports = router;
