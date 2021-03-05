const express = require('express');
const router = express.Router();
const queryLibrary = require('./queryLibrary');
const checkAuth = require('./routes/checkAuth');
const { query } = require('express');
const requestPromise = require('request-promise');
const parseXML = require("xml2js").parseString; //Example XML Parsing library
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

function extractProfileInfo(body, accessToken) {
    return new Promise(function(resolve, reject) {
        parseXML(body, function(err, obj) {
            if(err) {
                return reject("parse: " + err);
            } else {
                try {
                    var guid = obj.UserVO.userID[0];
                    var userName = obj.UserVO.userBaseVO[0].userName[0];
                    var nameInfo = obj.UserVO.userBaseVO[0].userBaseIndividualVO[0];
                    var email = "";
                    obj.UserVO.userIdentificationVO.forEach(function(x) {
                        if(x.loginIDTypeCode[0] === "003") {
                            email = x.loginID[0];
                        }
                    });
                    var lname = (nameInfo ? nameInfo.familyName[0] : " ");
                    var fname = (nameInfo ? nameInfo.givenName[0] : " ");
                    var profileImg = "";
                    if (obj.UserVO.userBaseVO[0].photographImageFileURLText) {
                        profileImg = obj.UserVO.userBaseVO[0].photographImageFileURLText[0];
                    }
 
                    var profileJSON = {
                        "guid": guid,
                        "name": userName,
                        "email": email,
                        "token": accessToken,
                        "lastName": (lname || " "),
                        "firstName": (fname || " "),
                        "profileImg": profileImg
                    };
                    return resolve(profileJSON);
                } catch(ex) {
                    return reject("parse: " + ex);
                }
            }
        });
    });
}


router.get('/login', (req, res)=> {
    const state = 'LoggedIN';
    const endpoint = '/sa/signin/callback';
    let url = checkAuth.encodeSignInQuery(state, endpoint);
    console.log('this is the redirect url=', url);
    res.redirect(url);
})

router.get('/logout', (req, res)=> {
    const state = 'LoggedOUT';
    let url = checkAuth.encodeSignOutQuery(state);
    console.log('this is the redirect url=', url);
    res.redirect(url);
})

router.get('/logout/complete', (req, res) => {
    req.user = null;
    if (req.cookies.jwt) {
        res.clearCookie('jwt');
    }
    res.redirect('http://54.202.165.130/posts');

})

//SIGNIN---------------
router.get('/sa/signin/callback', (req, res)=> {
    //console.log('$$$$$$$ req.body is= ', req.body);
    let code = req.query.code;
    //let state = req.query.state;
    let api_server_url = req.query.api_server_url;
    let auth_server_url = req.query.auth_server_url;
    if (!code || !api_server_url || !auth_server_url) {
        console.log('i am redirecting', code, api_server_url, auth_server_url);
        res.redirect('/');
        return;
    }
    var options = {
        url: `https://${auth_server_url}/auth/oauth2/token`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            grant_type: "authorization_code",
            code: code,
            client_id: "3694457r8f",
            client_secret: "ECF8F31E32F6DA9DC17C7704A1A4DE47"
        },
    };
    //Make a POST request to the auth_server_url, using your request library of choice
    //This example assumes a promise based request library
    //options.data = form;
    let accessToken = null;
    requestPromise(options)
        .then(response => {
            let user = JSON.parse(response);
            accessToken = user.access_token;
            //console.log('%%%%%% USER=', user);
            const signedToken = jwt.sign({user}, process.env.ACCESSCODE);
            res.cookie('jwt', signedToken,{maxAge:1000*60*60,httpOnly:true});
            var options = {
                url: `https://${api_server_url}/v2/profile/user/user/${user.userId}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken, //Access token provided from above response
                    'x-osp-appId': "3694457r8f",
                    'x-osp-userId': user.userId //userId provided from above response
                }
            };
            return requestPromise(options);
        })
        .then(response => {
            //console.log(response);
            return extractProfileInfo(response, accessToken);
        })
        .then(profile => {
            //console.log('PROFILE:', profile);
            queryLibrary.getUser(profile.guid)
                .then(data=> {
                    //console.log(data);
                    res.status(200).redirect('http://54.202.165.130/posts');
                })
                .catch(err => {
                    console.error("GET function error: ", err);
                });
            return;
        })
        .catch(err => {
            console.log("err=",err);
            res.send("BAD");
        });

    
})

module.exports = router;


