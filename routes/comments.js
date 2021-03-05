const express = require('express');
const router = express.Router();
const comments = require('../../Comments');
const uuid = require('uuid');
const mysql = require('mysql');

// Gets all comments

// router.get('/', (req, res) => {
//     mysqlConnection
// });

/*
router.get('/', (req, res) => {
    mysqlConnection.query('SELECT * FROM comments', (err, results) => {
        if (err) {
            throw err
        }
        res.status(200).json(results.rows);
    });
});
*/


// Create a new comment
router.post('/', (req, res) => {
    const newPost = {
        id: uuid.v4(),
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content
    }

    if(!newPost.userId || !newPost.title || !newPost.content) {
         return res.status(400).json( { msg: 'Please include userID, title and content'});
    }

    posts.push(newPost);
    res.json(posts);
    //res.redirect('/');
});

// Updates a post
router.put('/:id', (req, res) => {
    const found = posts.some(post => post.id === parseInt(req.params.id)); //returns a boolean

    if(found) {
        const updPost = req.body;
        posts.forEach(post => {
            if(post.id === parseInt(req.params.id)) {
                post.userId = post.userId;
                post.title = updPost.title ? updPost.title : post.title;
                post.content = updPost.content ? updPost.content : post.content;
                //post.title = updPost.title;
                //post.content = updPost.content;

                res.json({msg: 'Post updated', post});
            }
        });
    } else {
        res.status(400).json({ msg: `No post with the id of ${req.params.id}`});
    }
    
});


// Update Member
router.put('/:id', (req, res) => {
    const found = members.some(idFilter(req));
  
    if (found) {
      members.forEach((member, i) => {
        if (idFilter(req)(member)) {
  
          const updMember = {...member, ...req.body};
          members[i] = updMember
          res.json({ msg: 'Member updated', updMember });
        }
      });
    } else {
      res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
    }
  });
  
// Delete a post
router.delete('/:id', (req, res) => {
    const found = posts.some(post => post.id === parseInt(req.params.id)); //returns a boolean

    if(found) {
        res.json({ msg: 'Post deleted', posts: posts.filter(post => post.id !== parseInt(req.params.id))});
    } else {
        res.status(400).json({ msg: `No member with the id of ${req.params.id}`});
    }
    
});



module.exports = router;