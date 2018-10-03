/*********************************************************************************
*  WEB322 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ania M. Pienio  Student ID: 041780073 Date: September 29, 2018
*
*  Online (Heroku) Link:   https://salty-dawn-92326.herokuapp.com/
*
********************************************************************************/ 

const HTTP_PORT = process.env.PORT || 8081;
const express = require("express");
const path = require("path");
var dataService = require("./data-service")
const app = express();

app.use(express.static('public'));

app.get("/", (req, res) => {
    console.log("Express http server listening on " + HTTP_PORT);
    res.sendFile(path.join(__dirname, "/views/home.html"));   
});

app.get("/about", (req, res) => {
   res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/employees", (req, res) => {
    dataService.getAllEmployees().then((employees)=> {
        res.json(employees);
    }).catch((NoResults)=>{
        res.json({message: NoResults}); 
    });
});

app.get("/departments", (req, res) => {
    dataService.getDepartments().then((departments)=> {
        res.json(departments);
    }).catch((NoResults)=>{
        res.json({message: NoResults});   
    });    
});

app.get("/managers", (req, res) => {
    dataService.getManagers().then((managers)=> {
        res.json(managers);
    }).catch((NoResults)=>{
        res.json({message: NoResults});
    });        
});

// 404 error //
app.all("*", (req, res)=>{
    res.status(404).sendFile(path.join(__dirname, "/views/error.html")) 
});

dataService.initialize().then((MsgOk)=>{
    console.log(MsgOk);
    app.listen(HTTP_PORT);
    
}).catch((MsgNoGo)=>{
    console.log(MsgNoGo);
});