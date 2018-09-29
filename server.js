/*********************************************************************************
*  WEB322 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ania M. Pienio  Student ID: 041780073 Date: September 29, 2018
*
*  
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8081;
var express = require("express");
var path = require("path");
//var dataService = require("./data-service")
var employees = require("./data/employees")
var departments = require("./data/departments")
var app = express();

app.use(express.static('public'));

app.get("/", (req, res) => {
    console.log("Express http server listening on " + HTTP_PORT);
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req, res) => {
   res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/employees", (req, res) => {
    res.json(employees);    
});

app.get("/departments", (req, res) => {
    res.json(departments);    
});

app.get("/managers", (req, res) => {
    res.send("TODO: get all employees who have isManager==true");    
});



app.listen(HTTP_PORT);