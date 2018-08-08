
/**
 * Router
 * This file is in charge of defining the route to controller connection,
 * for example - all requests starting with www.website.com/auth/XXX will go to the proper function in authController
 */
const router = require('express').Router();

router.use('/auth', require('./authController'));
router.use('/recipe', require('./recipesController'));
module.exports = router;