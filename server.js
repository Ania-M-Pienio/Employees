/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ania M. Pienio  Student ID: 041780073 Date: October 26, 2018
*
*  Online (Heroku) Link:  
*
********************************************************************************/ 

const HTTP_PORT = process.env.PORT || 8081;
const express = require("express");
const path = require("path");
var dataService = require("./data-service")
const app = express();
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    console.log("Express http server listening on " + HTTP_PORT);
    res.sendFile(path.join(__dirname, "/views/home.html"));   
});

app.get("/about", (req, res) => {
   res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/employees/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
 });

 app.get("/images/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addImage.html"));
 });

 app.get("/images", (req, res) => {
     fs.readdir("./public/images/uploaded", (err, items) => {
     //console.log(items);
     res.json(items);
     });
 });

app.get("/employees/:status?/:department?/:manager?", (req, res) => {
    const STATUS = req.query.status;
    const DEPARTMENT = req.query.department;
    const MANAGER = req.query.manager;
    // if status
    if (STATUS) {
        dataService.getEmployeesByStatus(STATUS).then((employeesByStatus) => {
            res.json(employeesByStatus);
        }).catch((NoResults) => {
            res.json({message: NoResults})
        });
    }         
    /////// if department
    else if (DEPARTMENT) {  
        dataService.getEmployeesByDepartment(DEPARTMENT).then((employeesByDepartment) => {
            res.json(employeesByDepartment);
        }).catch((NoResults) => {
            res.json({message: NoResults})
        });
    }
    //////// if manager 
    else if (MANAGER) {        
        dataService.getEmployeesByManager(MANAGER).then((employeesByManager) => {
            res.json(employeesByManager);
        }).catch((NoResults) => {
            res.json({message: NoResults}) 
        });        
    } 
    else {
   //////// no query - all employees
    dataService.getAllEmployees().then((employees)=> {
        res.json(employees);
    }).catch((NoResults) => {
        res.json({message: NoResults}); 
    });
    }
});

app.get("/employee/:value", (req, res) => {
    dataService.getEmployeeByNum(req.params.value).then((employee) => {
        console.log(req.params.value);
        res.json({value: employee});
    }).catch((NoResults) => {
        res.json({message: NoResults}) 
    });
});

app.get("/departments", (req, res) => {
    dataService.getDepartments().then((departments)=> {
        res.json(departments);
    }).catch((NoResults) => {
        res.json({message: NoResults});   
    });    
});

app.get("/managers", (req, res) => {
    dataService.getManagers().then((managers)=> {
        res.json(managers);
    }).catch((NoResults) => {
        res.json({message: NoResults});
    });        
});

const storage = multer.diskStorage( {
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body).then(() => {
        res.redirect("/employees");
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