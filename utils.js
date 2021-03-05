const express = require('express');
function renderHelper(req, res, filePath, localsObj) {
    localsObj.userSession = req.user;
    // console.log('localsObj = ', localsObj);
    // console.log('localsObj.userSession = ', localsObj.userSession);
    if (!localsObj) {
        localsObj = {};
    };
    if(!localsObj.page) {
        localsObj.page = 'defaultPage';
    }
    res.render(filePath, localsObj);

}

module.exports = {renderHelper};