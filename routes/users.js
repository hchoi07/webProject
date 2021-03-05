const express = require('express');
const router = express.Router();
const posts = require('../../Posts');
const uuid = require('uuid');
const queryLibrary = require('../../queryLibrary');
const { query } = require('express');




// Gets all posts
router.get('/', (req, res) => {
    console.log("testtesttest");
    res.json(posts);
});

// Create a new post
router.user('/', (req, res) => {
    const newPost = {
        userId: req.body.userId,
        Saguid: req.body.Saguid
    }
});



module.exports = router;