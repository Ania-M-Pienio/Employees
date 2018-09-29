/*********************************************************************************
*  WEB322 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ania M. Pienio  Student ID: 041780073 Date: September 29, 2018
*
*  
*
********************************************************************************/ 



var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");

app.use(express.static('public'));

app.get("/", (req, res) => {
    //console.log("Express http server listening on" + HTTP_PORT);
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req, res) => {
    console.log("Express http server listening on" + HTTP_PORT);
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.listen(HTTP_PORT);