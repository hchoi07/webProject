const mysql = require('mysql');

// const mysqlConnection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: "APIDatabase",
//     multipleStatements: true
// });

const mysqlConnection = mysql.createConnection({
    host: 'd-usw2-demo.cluster-cfvxocyrwjwo.us-west-2.rds.amazonaws.com',
    user: 'dev01',
    password: '4dta!30',
    database: "dev01",
    multipleStatements: true
});



mysqlConnection.connect((err) => {
    if(!err) {
        console.log("connected to database");
    } else {
        console.log("connection to database failed");
    }
});


function createPost(newPost) {
    return new Promise((resolve, reject) => {
        let sqlQuery = 'INSERT INTO posts (Saguid, title, content) VALUES (?,?,?)';

        return mysqlConnection.query(sqlQuery, [newPost.Saguid, newPost.title, newPost.content], function(err, result) {
            if (err) {
                return reject(err);
            }
            else {
                console.log(result);
                return resolve(result);
            }
        });

    });
}

function upvotePost(Saguid, postID) {
    return new Promise((resolve, reject) => {
        let sqlQuery = 'INSERT INTO votes (Saguid, postID) VALUES (?,?)';
        return mysqlConnection.query(sqlQuery, [Saguid, postID], function(err, result) {
            if(err) {
                return reject(err);
            }
            else {
                console.log(result);
                return resolve(result);
            }
        })
    })
}

function getUpvotes(postID) {
    console.log('%%%%% Entering getUpVotes function');
    return new Promise((resolve, reject) => {
        let sqlQuery = 'SELECT COUNT(postID) AS count FROM votes WHERE postID = ? ';
        return mysqlConnection.query(sqlQuery, [postID], function(err, result) {
            if(err) {
                return reject(err);
            }
            else {
                console.log("from query library #######", result);
                return resolve(result);
            }
        })
    })
}

// const upvoteCount = (req, res, next) => {
//     const postID = req.params.ID;
//     req.count = 0;
//     req.count = getUpvotes(postID)
//         .then(data => {
//             res.status(200).send('OK');
//         })
//         .catch(err => {
//             console.error("FETCH UPVOTES function error", err);
//         })
//     console.log("@@@@HOW MANY UPVOTES? : ", req.count);
//     next();
// }


function getAllPosts() {
    //TODO: get upvote data

    return new Promise((resolve, reject) => {
        let sqlQuery = 'SELECT * FROM posts';
        return mysqlConnection.query(sqlQuery, function(err, results, fields) {
            if(err) {
                return reject(err);
            } else if (results.length == 0) {
                return resolve(false);
            } else {
                return resolve(results);
            }
        });
    });
}



function getPost(ID) {
    console.log(ID);
    return new Promise((resolve, reject) => {
        let sqlQuery = 'SELECT * FROM posts WHERE ID = ?';
        return mysqlConnection.query(sqlQuery, [ID], function(err, results, fields) {
            if(err) {
                return reject(err);
            } else if (results.length == 0) {
                return reject("Post Not Found");
            } else {
                return resolve(results[0]);
            }
        });
    });
}



function deletePost(ID) {
    return new Promise((resolve, reject) => {
        let sqlQuery = 'DELETE FROM posts WHERE ID = ?';
        return mysqlConnection.query(sqlQuery, [ID], function(err, result) {
            if (err) {
                return reject(err);
            }
            else {
                console.log("Post successfully deleted");
                return resolve(true);
            }
        });

    });
}



function updatePost(updPost, ID) {
    console.log(updPost);
    return new Promise((resolve, reject) => {
        let sqlQuery = 'UPDATE posts SET title = ?, content = ? WHERE ID = ?';
        return mysqlConnection.query(sqlQuery, [updPost.title, updPost.content, ID], function(err, result) {
            if (err) {
                return reject(err);
            }
            else {
                console.log("Post successfully updated");
                return resolve(result);
            }
        });

    });
}

//----------------------------------------

function createComment(newComment, parentPostID) {
    return new Promise((resolve, reject) => {
        let sqlQuery = 'INSERT INTO comments (Saguid, content, parentPost) VALUES (?,?,?)';

        mysqlConnection.query(sqlQuery, [newComment.Saguid, newComment.content, parentPostID], function(err, result) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(result);
            }
        });

    });
}

function getAllComments(parentPostID) {
    return new Promise((resolve, reject) => {
        let sqlQuery = 'SELECT * FROM comments WHERE parentPost = ?';
        return mysqlConnection.query(sqlQuery, [parentPostID], function(err, results, fields) {
            if(err) {
                return reject(err);
            } else if (results.length == 0) {
                return resolve(results);
            } else {
                return resolve(results);
            }
        });
    });
}

function deleteComment(commentID) {
    return new Promise((resolve, reject) => {
        let sqlQuery = 'DELETE FROM comments WHERE commentID = ?';
        return mysqlConnection.query(sqlQuery, [commentID], function(err, result) {
            if (err) {
                return reject(err);
            }
            else {
                console.log("Comment successfully deleted");
                return resolve(true);

            }
        });

    });
}

function updateComment(updComment, ID, commentID) {
    return new Promise((resolve, reject) => {
        let sqlQuery = 'UPDATE comments SET content = ? WHERE commentID = ?';
        return mysqlConnection.query(sqlQuery, [updComment.content, commentID], function(err, result) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(result);
            }
        });

    });
}

//------user functions:
function getUser(Saguid) {
    return new Promise((resolve, reject) => {
        let sqlQuery = 'SELECT * FROM users where Saguid = ?';
        return mysqlConnection.query(sqlQuery, [Saguid], function(err, result) {
            if(err) {
                return reject(err);
            }
            else if(result.length === 0) {
                return resolve("user is not found, sorry!");
            }
            else {
                console.log("user is found, congraaaats = ", Saguid);
                //console.log("result is ", result);
                resolve(result);
            }
        });
    });
}



module.exports = {
    createPost, 
    getAllPosts, 
    getPost,
    deletePost,
    updatePost,
    createComment,
    getAllComments,
    deleteComment,
    updateComment,
    getUser,
    upvotePost,
    getUpvotes,
};
