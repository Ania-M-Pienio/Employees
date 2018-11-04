/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ania M. Pienio  Student ID: 041780073 Date: October 26, 2018
*
*  Online (Heroku) Link:  https://git.heroku.com/salty-dawn-92326.git
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
const exphbs = require("express-handlebars");


app.engine('.hbs', exphbs({ 
    extname: '.hbs', 
    defaultLayout: "main",
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        }
    }
}));

app.set('view engine', '.hbs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
    });

app.get("/", (req, res) => {
    console.log("Express http server listening on " + HTTP_PORT);
    res.render("home", {defaultLayout: true});   
});

app.get("/about", (req, res) => {
    res.render("about", {defaultLayout: true});   
});

app.get("/employees/add", (req, res) => {
    res.render("addEmployee", {defaultLayout: true});   
 });

 app.get("/images/add", (req, res) => {
    res.render("addImage", {defaultLayout: true});
 });

 app.get("/images", (req, res) => {
     fs.readdir("./public/images/uploaded", (err, items) => {
         res.render("images", {
             data: items,
             defaultLayout: true
            });         
     });
 });

app.get("/employees/:status?/:department?/:manager?", (req, res) => {
    const STATUS = req.query.status;
    const DEPARTMENT = req.query.department;
    const MANAGER = req.query.manager;
    // if status
    if (STATUS) {
        dataService.getEmployeesByStatus(STATUS).then((employeesByStatus) => {
            res.render("employees", {
                data: employeesByStatus,
                defaultLayout: true
               });            
        }).catch((NoResults) => {
            res.render("employees",{
                message: NoResults,
                defaultLayout: true
            });
        });
    }         
    /////// if department
    else if (DEPARTMENT) {  
        dataService.getEmployeesByDepartment(DEPARTMENT).then((employeesByDepartment) => {
            res.render("employees", {
                data: employeesByDepartment,
                defaultLayout: true
               });          
        }).catch((NoResults) => {
            res.render("employees",{
                message: NoResults,
                defaultLayout: true
            });
        });
    }
    //////// if manager 
    else if (MANAGER) {        
        dataService.getEmployeesByManager(MANAGER).then((employeesByManager) => {
            res.render("employees", { 
                data: employeesByManager,               
                defaultLayout: true
               });    
        }).catch((NoResults) => {
            res.render("employees",{
                message: NoResults,
                defaultLayout: true
            });
        });
    } 
    else {
   //////// no query - all employees
    dataService.getAllEmployees().then((employees)=> {
        res.render("employees", {
            data: employees,
            defaultLayout: true
           }); 
       }).catch((NoResults) => {
        res.render("employees", {
            message: NoResults,
            defaultLayout: true
        }); 
    });
    }
});

app.get("/employee/:value", (req, res) => {
    dataService.getEmployeeByNum(req.params.value).then((employee) => {
        res.render("employee", {
            employee: employee,
            defaultLayout: true
        });
    }).catch((NoResults) => {
        res.render("employee", {
            message: NoResults,
            defaultLayout: true
        }); 
    });
});

app.get("/departments", (req, res) => {
    dataService.getDepartments().then((departments)=> {
        res.render("departments", {
            data: departments,
            defaultLayout: true
        });
        //res.json(departments);
    }).catch((NoResults) => {
        res.json("departments", {
            message: NoResults,
            defaultLayout: true
        });   
    });    
});

const storage = multer.diskStorage( {
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});


app.post("/employee/update", (req, res) => {
    console.log(req.body);
    res.redirect("/employees");
});

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