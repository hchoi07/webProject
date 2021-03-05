const express = require('express');
const router = express.Router();
const posts = require('../Posts');
const comments = require('../Comments');
const queryLibrary = require('../queryLibrary');
const { query } = require('express');


// Create a new post
router.post('http://54.202.165.130/posts', (req, res, next) => {
    if(req.currentUser === undefined) {
        // return res.redirect('http://localhost:5000/401');
        //return res.status(401).json( {msg: 'You must be logged in to submit a post!'});
        //console.log("current user is undefined!");
        return next('/401');
    }
    //console.log('CURRENT USER IS= ', req.currentUser);
    // console.log('CURRENT USER ID IS= ', req.currentUser.userId);
    // console.log('current user stringified is= ', JSON.stringify(req.currentUser));
    let currentUser = JSON.parse(JSON.stringify(req.currentUser));
    //console.log('will this actually be defined now???', currentUser.user.userId);
    const newPost = {
        Saguid: currentUser.user.userId,
        title: req.body.title,
        content: req.body.content
    }
    //console.log("&&&&REQ>BODY:", req.body)
    console.log("&&&& NEW POST:", newPost);
    if(!newPost.title || !newPost.content) {
        //console.log("*****NO CONTENT");
         return res.status(400).json( { msg: 'Please include title and content'});
    }
    queryLibrary.createPost(newPost)
        .then(data => {
            //console.log(data);
            res.status(200).send("OK");
        })
        .catch(err => {
            console.error("CREATE POST function error: ", err);
        });
});


// Updates a post
router.put('http://54.202.165.130/:ID', (req, res, next) => {
    if(req.currentUser === undefined) {
        return next('/401');
    }
    //console.log('CURRENT USER IS= ', req.currentUser);
    let currentUser = JSON.parse(JSON.stringify(req.currentUser));
    //console.log('will this actually be defined now???', currentUser.user.userId);
    const ID = req.params.ID;
    const updPost = {
        title: req.body.title,
        content: req.body.content
    }
    // console.log(req.params);
    // console.log(req.body);
    if(!updPost.title || !updPost.content) {
        //console.log("*****NO CONTENT");
         return res.status(400).json( { msg: 'Please include title and content'});
    }
    queryLibrary.updatePost(updPost, ID)
        .then(data=> {
            //console.log(data);
            res.status(200).send("OK");
        })
        .catch(err => {
            console.error("UPDATE POST function error: ", err);
        });
});


// Delete a post
router.delete('http://54.202.165.130/:ID', (req, res) => {
    const ID = req.params.ID;
    if(req.currentUser === undefined) {
        return;
    }
    let currentUser = JSON.parse(JSON.stringify(req.currentUser));
        //console.log(req.params);
        queryLibrary.deletePost(ID)
            .then(data=> {
                //console.log(data);
                res.status(200).send("OK");
            })
            .catch(err => {
                console.error("DELETE POST function error: ", err);
            });
});


// Delete comment
router.delete('http://54.202.165.130/:ID/comments/:commentID', (req, res, next) => {
    const ID = req.params.ID;
    const commentID = req.params.commentID;
    if(req.currentUser === undefined) {
        return next('/401');
    }
    let currentUser = JSON.parse(JSON.stringify(req.currentUser));
        console.log(req.params);
        queryLibrary.deleteComment(commentID)
            .then(data=> {
                //console.log(data);
                res.status(200).send("OK");
            })
            .catch(err => {
                console.error("DELETE function error: ", err);
            });
});

// Upvote
router.post('http://54.202.165.130/:ID/votes', (req, res, next) => {
    const postID = req.params.ID;
    if(req.currentUser === undefined) {
        return next('/401');
    }
    let currentUser = JSON.parse(JSON.stringify(req.currentUser));
    let Saguid = currentUser.user.userId;
    console.log("coming from router.js = post ID and Saguid is ", postID, Saguid);
    queryLibrary.upvotePost(Saguid, postID)
        .then(data => {
            res.status(200).send('OK');
        })
        .catch(err => {
            console.error("UPVOTE function error: ", err);
        });
});



// Create a comment
router.post('http://54.202.165.130/:ID', (req, res) => {
    //console.log("@@@@@Create comment function");
    console.log('CURRENT USER IS= ', req.currentUser);
    // console.log('CURRENT USER ID IS= ', req.currentUser.userId);
    // console.log('current user stringified is= ', JSON.stringify(req.currentUser));
    let currentUser = JSON.parse(JSON.stringify(req.currentUser));
    //console.log('will this actually be defined now???', currentUser.user.userId);
    const parentPostID = req.params.ID;
    const newComment = {
        Saguid: currentUser.user.userId,
        content: req.body.content
    }
    if(!newComment.content) {
        //console.log("*****NO CONTENT");
         return res.status(400).json( { msg: 'Please write something'});
    }
    queryLibrary.createComment(newComment, parentPostID)
        .then(data => {
            //console.log("CREATING COMMENT DONE", data);
            res.status(200).send(data);
        })
        .catch(err => {
            console.error("CREATE COMMENT function error: ", err);
        });
});


// Gets all posts
router.get('http://54.202.165.130', (req, res) => {
    //console.log("testtesttest");
    //res.json(posts);
    queryLibrary.getAllPosts()
        .then(data => {
            //console.log(data);
            res.status(200).send(data);
        })
        .catch(err => {
            console.error("GET ALL POSTS function error: ", err);
        });
});


// Gets a single post
router.get('http://54.202.165.130/:ID', (req, res) => {
    const ID = req.params.ID;
    //console.log(req.params);
    queryLibrary.getPost(ID)
        .then(data=> {
            console.log("######## from router.js: get a single post data");
            res.status(200).send(data);
        })
        .catch(err => {
            console.error("GET function error: ", err);
        });
   
});


router.get('http://54.202.165.130/:ID/votes', (req, res) => {
    const ID = req.params.ID;
    queryLibrary.getUpvotes(ID)
        .then(data=> {
            console.log("$$$$$$ from router.js: get #of votes on a post data: ", data[0].count);
            let count = data[0].count;
            res.send(data);
        })
        .catch(err => {
            console.error("GET function error: ", err);
        });

})



// fetch upvote count
// router.get('/:ID', (req, res) => {
//     const postID = req.params.ID;
//     queryLibrary.getUpvotes(postID)
//         .then(data => {
//             res.status(200).send('OK');

//         })
//         .catch(err => {
//             console.error("FETCH UPVOTES function error", err);
//         })
// })

//-----------------------


// Update User
router.put('http://54.202.165.130/:ID', (req, res) => {
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
      res.status(400).json({ msg: `No member with the id of ${req.params.ID}` });
    }
  });

//-----------------------

// Get all comments (? Helper function?)
router.get('http://54.202.165.130/:ID/comments', (req, res) => {
    const parentPostID = req.params.ID;
    queryLibrary.getAllComments(parentPostID)
        .then(data => {
            //console.log(data);
            res.status(200).send(data);
        })
        .catch(err => {
            console.error("FETCH COMMENT function error: ")
        });
});


// Update comment
router.put('http://54.202.165.130/:ID/comments/:commentID', (req, res) => {
    const ID = req.params.ID;
    const commentID = req.params.commentID;
    const updComment = {
        content: req.body.content
    }

    // console.log(req.params);
    // console.log(req.body);
    queryLibrary.updatePost(updPost, ID, commentID)
        .then(data=> {
            //console.log(data);
            res.status(200).send("OK");
        })
        .catch(err => {
            console.error("UPDATE COMMENT function error: ", err);
        });
});




module.exports = router;