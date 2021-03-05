const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function encodeSignInQuery(state, endpoint) {
    
    let data = {
        url : 'https://stg-account.samsung.com/accounts/v1/STWS/signInGate?',
        params : {
            response_type :'code',
            locale :'en',
            countryCode:'US',
            client_id :'3694457r8f',
            redirect_uri :'http://54.202.165.130' + endpoint,
            state : state,
            goBackURL : 'http://54.202.165.130'
        }
    }
    let querystring = data.url;
    for(let d in data.params) {
        querystring += encodeURIComponent(d) + '=' + encodeURIComponent(data.params[d]) + '&'
    }
    console.log("resulting SignInquerystring: ", querystring);
    return querystring.slice(0, -1);
}

function encodeSignOutQuery(state) {
    let data = {
        url : 'https://stg-account.samsung.com/accounts/v1/STWS/signOutGate?',
        params : {
            client_id :'3694457r8f',
            state : state,
            signOutURL : 'http://54.202.165.130/logout/complete'
        }
    }
    let querystring = data.url;
    for(let d in data.params) {
        querystring += encodeURIComponent(d) + '=' + encodeURIComponent(data.params[d]) + '&'
    }
    console.log("resulting SignOut querystring: ", querystring);
    return querystring.slice(0, -1);
}



const authenticateJWT = (req, res, next) => {
    req.isLoggedIn = false;
    req.user = null;
    //console.log('(MIDDLEWARE) req.user is=', req);
    if (!req.cookies.jwt) {
        const authHeader = req.headers.authorization;
        //console.log("THIS IS AUTHHEADER: ", authHeader, typeof authHeader);
        if(authHeader) {
            const accessToken = authHeader.split(" ")[1];
            console.log("THIS IS ACCESS TOKEN: ", accessToken);
            jwt.verify(accessToken, process.env.ACCESSCODE, (err, user) => {
                if (err) {
                    console.log("ERROR WHILE VERIFYING JWT", err);
                    return res.status(403).send();
                }
                req.user = user;
                //console.log("this is the current user= ", req.user);
                //console.log("authenticateJWT middleware worked");
                next();
            });
        }
        next();
    } else {
        const signedToken = req.cookies.jwt;
        //console.log("THIS IS ACCESS TOKEN22222: ", signedToken);
        jwt.verify(signedToken, process.env.ACCESSCODE, (err, user) => {
            if (err) {
                console.log("You are not logged in", err);
                return res.status(401).send();
            } else{
                //console.log("authenticateJWT middleware worked");
                req.user = user;
            }
            req.isLoggedIn = true;
            req.currentUser = user;
            console.log("this is the current user= ", req.currentUser);
            //console.log("this is the current user's Saguid= ", req.currentUser.user.userId);

            next();
        })
    }
};


module.exports = {
    authenticateJWT,
    encodeSignInQuery,
    encodeSignOutQuery
}
