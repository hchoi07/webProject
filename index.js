const express = require('express');
const path = require('path');
const posts = require('./Posts');
const comments = require('./Comments');
const users = require('./Users');
const utils = require('./utils');
const cors = require('cors');
const queryLibrary = require('./queryLibrary');
const router = require('./routes/router');
const jwt = require('jsonwebtoken');
const checkAuth = require('./routes/checkAuth');
const auth_router = require('./auth_router');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const moment = require('moment');
require('dotenv').config();


const app = express();
//middlewares init
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(checkAuth.authenticateJWT);

app.use(cors());
app.set('views', path.join(__dirname, 'views'));

//register view engine
app.set('view engine', 'ejs'); 

// handle form submissions
app.use(express.urlencoded( { extended: false }));

// set up public folder
app.use(express.static(path.join(__dirname, 'public')));

// Posts API routes
app.use(auth_router);
app.use('/api/posts', router);




app.get('/posts', (req, res) => {
    let loginState = req.isLoggedIn;
    // let count = req.count;
    //console.log("my user session:", req.user);
    utils.renderHelper(req, res, 'pages/posts.ejs', {page: "posts_page", loginState});
})

app.get('/posts/:ID', (req, res) => {
    let loginState = req.isLoggedIn;
    // let count = req.count;
    let currSession = req.currentUser;
    console.log("this is currSession **** = ", currSession);
    console.log("AM I LOGGED IN? = ", loginState);
    let id = req.params.ID;
    queryLibrary.getPost(id)
        .then(data => {
            console.log('*****THIS IS DATA= ', data);
        utils.renderHelper(req, res, 'pages/post.ejs', {ID: data.ID, Saguid:data.Saguid, date:data.date, title:data.title, content:data.content, modifiedOn:data.modifiedOn, loginState, currSession, moment: moment}); //"..." is a spread operator
        })
        .catch(err => {
            console.log("ERR IN GET SINGLE POST")
        });
});


app.get('/', (req, res) => {
    //console.log('this is the user***:', req.user);
    if (req.user) {
        res.redirect('/posts');
        return;
    }
    utils.renderHelper(req, res, 'pages/index.ejs', {posts});
})

// app.get('/new', (req, res) => {
//     if (!req.user) {
//         res.redirect('/401');
//         return;
//     }
//     utils.renderHelper(req, res, 'pages/new.ejs', {posts});
// })

app.get('/401', (req, res) => {
    res.render('pages/401');
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
