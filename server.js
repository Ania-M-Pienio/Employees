/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ania M. Pienio  Student ID: 041780073 Date: November 15, 2018
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

app.use(function(req, res, next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.get("/", (req, res) => {
    console.log("Express http server listening on " + HTTP_PORT);
    res.render("home", {
        defaultLayout: true
    });   
});

app.get("/about", (req, res) => {
    res.render("about", {
        defaultLayout: true
    });   
});

app.get("/employees/add", (req, res) => {
    dataService.getDepartmentById().then((departments) => {
        res.render("addEmployee", {
            data: departments,
            defaultLayout: true
        }); 
    }).catch(() => {
        res.render("addEmployee", {
            message: [],
            defaultLayout: true
    });
 });

 app.get("/images/add", (req, res) => {
    res.render("addImage", {
        defaultLayout: true
    });
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
    ////// if status
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
        console.log("Promise Returned Successfully!");
        if (employees.length > 0) {
            res.render("employees", {
                data: employees,
                defaultLayout: true
            }); 
        } else {
            res.render("employees", {
                message: "no results"
            }); 
        } 
        }).catch((NoResults) => { // "no results returned"
        console.log("Promise now in Rejection!");
            res.render("employees", {
                message: NoResults,
                defaultLayout: true
            }); 
        });    
    }    
});

app.get("/employee/:value", (req, res) => {
    let viewData = {};
    dataService.getEmployeeByNum(req.params.empNum).then((employee) => {
        if (employee) {
            viewData.employee = employee; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(dataService.getDepartments).then((department) => {
            viewData.departments = department; // store department data in the "viewData" object as "departments"

            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching
            // viewData.departments object

            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
    }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
        } else {
            res.render("employee", { viewData: viewData }); // render the "employee" view
        }
    });
});

app.get("/departments", (req, res) => {
    dataService.getDepartments().then((departments)=> {
       if (departments.length > 0) {
            res.render("departments", {
                data: departments,
                defaultLayout: true
            });
        } else {
            res.render("departments", {
                message: "no results"
            });
        }   
    }).catch((NoResults) => {
        res.render("departments", {
            message: NoResults,
            defaultLayout: true
        });   
    });    
});

app.get("/departments/add", (req, res) => {
    res.render("addDepartment", {
        defaultLayout: true
    });
});

app.get("/department/:departmentId", (req, res) => {
    dataService.getDepartmentById(req.params.departmentId).then((department) => {
        if (department) {
            res.render("departments", {            
                data: department,
                defaultLayout: true
            });
        } else {
            res.status(404).send("Department Not Found");
        }        
    }).catch((NoResults) => {
       res.status(404).send("Department Not Found");
    }); 
});

app.get("/departments/delete/:departmentId", (req, res) => {
    dataService.deleteDepartmentById(req.param.departmentId).then(() => {
        res.redirect("/departments");
    }).catch(() => {
        res.status(500).send("Unable to Remove Department / Department not found");
    });
});

app.get("/employees/delete/:value", (req, res) => {
    dataService.deleteEmployeeByNum(req.params.value).then(() => {
        res.redirect("/employees");          
    }).catch(() => {
        res.status(500).send("Unable to Remove Employee / Employee not found");
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
    dataService.updateEmployee(req.body).then(() => {
        console.log(req.body);
        res.redirect("/employees");
    });
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    });
});

app.post("/departments/add", (req, res) => {
    dataService.addDepartment(req.body).then(() => {
        res.redirect("/departments");
    });
});

add.post("/department/update", (req, res) => {
    dataService.updateDepartment(req.body).then(() => {
        console.log(req.body);
        res.redirect("/departments");
    }).catch(() => {
        res.status(500).send("Unable to Update Department");
    });
});


// 404 error //
app.all("*", (req, res)=>{
    res.status(404).sendFile(path.join(__dirname, "/views/error.html")); 
});


dataService.initialize()
.then((MsgOk)=>{
    console.log(MsgOk);
    app.listen(HTTP_PORT);    
}).catch((MsgNoGo) => {
    console.log(MsgNoGo);
});