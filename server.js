/*********************************************************************************
*  WEB322 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ania M. Pienio  Student ID: 041780073 Date: November 28, 2018
*
*  Online (Heroku) Link:  
*
********************************************************************************/ 

const HTTP_PORT = process.env.PORT || 8081;
const express = require("express");
const path = require("path");
var dataService = require("./data-service");
var dataServiceAuth = require("./data-service-auth");
const app = express();
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const clientSession = require("client-sessions")

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});
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

app.use(clientSession({
    cookieName: "session",
    secret: "CrosslandAffair",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}));

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

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

app.get("/employees/add", ensureLogin, (req, res) => {
    dataService.getDepartments()
    .then((theDepartments) => {
        res.render("addEmployee", {
            departments: theDepartments,
            defaultLayout: true
        }); 
    }).catch(() => {
        res.render("addEmployee", {
            departments: [],
            defaultLayout: true
    });
  }).catch(() => {
      res.status(500).send("Unable to Add Employee");
  });
});

app.get("/departments/add", ensureLogin, (req, res) => {
    res.render("addDepartment", {
        defaultLayout: true
    });
});

 app.get("/images", ensureLogin, (req, res) => {
     fs.readdir("./public/images/uploaded", (err, items) => {
         res.render("images", {
             data: items,
             defaultLayout: true
            });         
     });
 });

 app.get("/images/add", ensureLogin, (req, res) => {
    res.render("addImage", {
        defaultLayout: true
    });
 });

 app.get("/employees/delete/:empNum", ensureLogin, (req, res) => {
    dataService.deleteEmployeeByNum(req.params.empNum)
    .then(() => {
        res.redirect("/employees");          
    }).catch(() => {
        res.status(500).send("Unable to Remove Employee / Employee not found");
    });
});

app.get("/employees/:status?/:department?/:manager?/", ensureLogin, (req, res) => {
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
    dataService.getAllEmployees()
        .then((employees)=> {
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
                res.render("employees", {
                message: NoResults,
                defaultLayout: true
            }); 
        });    
    }    
});



app.get("/employee/:value", ensureLogin, (req, res) => {
    let viewData = {}; // empty object
    dataService.getEmployeeByNum(req.params.value)
    
    .then((theEmployee) => {
        if (theEmployee) {
            viewData.employee = theEmployee; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(dataService.getDepartments).then((theDepartments) => {
            viewData.departments = theDepartments; // store department data in the "viewData" object as "departments"
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

app.get("/departments", ensureLogin, (req, res) => {
    dataService.getDepartments()
    .then((departments)=> {
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

app.get("/department/:departmentId", ensureLogin, (req, res) => {
    console.log(req.params.departmentId);
    dataService.getDepartmentById(req.params.departmentId)
    .then((department) => {
        if (department) {
            res.render("department", {            
                department: department,
                defaultLayout: true
            });
        } else {
            res.status(404).send("Department Not Found");
        }        
    }).catch(() => {
       res.status(404).send("Department Not Found");
    }); 
});

app.get("/departments/delete/:departmentId", ensureLogin, (req, res) => {
    dataService.deleteDepartmentById(req.params.departmentId)
    .then(() => {
        res.redirect("/departments");
    }).catch(() => {
        res.status(500).send("Unable to Remove Department / Department not found");
    });
});

app.get("/userHistory", ensureLogin, (req, res) => {
    console.log("---- is there a session: -------");
    console.log(req.session);
    res.render("userHistory", {
        defaultLayout: true,
        session: req.session
    });
});

app.get("/login", (req, res) => {
    res.render("login", {
        defaultLayout: true
    });
});

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/login");
});

app.get("/register", (req, res) => {
    res.render("register", {
        defaultLayout: true
    });
});

////////////////////////  POST ////////////////////////////////////////////////////////////


app.post("/employee/update", ensureLogin, (req, res) => {
    dataService.updateEmployee(req.body)
    .then(() => {
        console.log(req.body);
        res.redirect("/employees");
    }).catch((msg) => {
        res.status(500).send("Unable to Update Employee");
    });
});

app.post("/images/add", ensureLogin, upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.post("/employees/add", ensureLogin, (req, res) => {
    console.log("Is department present: >>>>>>>>>>>" + req.body.department + "<<<<<<<<<<<");
    dataService.addEmployee(req.body)
    .then(() => {
        res.redirect("/employees");
    }).catch(() => {
        res.status(500).send("Unable to Add Employee");
    });
});

app.post("/departments/add", ensureLogin, (req, res) => {
    dataService.addDepartment(req.body)
    .then(() => {
        res.redirect("/departments");
    }).catch((msg) => {
        res.status(500).send("Unable to Add Department");
    });
});

app.post("/department/update", ensureLogin, (req, res) => {
    dataService.updateDepartment(req.body).then(() => {
        console.log(req.body);
        res.redirect("/departments");
    }).catch((msg) => {
        res.status(500).send("Unable to Update Department");
    });
});

app.post("/login", (req, res) => {
    console.log(" POST /login ------------------------ > ------>");
    req.body.userAgent = req.get("User-Agent");
    dataServiceAuth.checkUser(req.body).then((user) => {
        console.log(" POST /login + THEN ------------------------ > ------>");
        req.session.user = {
        userName : user.userName,
        email : user.email,
        loginHistory: user.loginHistory
        }
        res.redirect("/employees");        
    })
    .catch((err) => {
        console.log(" POST /login + CATCH ------------------------ > ------>");
        res.render("login.hbs", {
            defaultLayout: true,
            errorMessage: err
        });
    });
});

app.post("/register", (req, res) => {
    console.log(" POST /register ------------------------ > ------>");
    dataServiceAuth.registerUser(req.body).then(() => {
        console.log(" POST /register ------ + THEN ------------------ > ------>");
        res.render("register", {
            defaultLayout: true,
            successMessage: "User created"
        });
    })
    .catch((err) => {
        console.log(" POST /register ------+ CATCH ------------------ > ------>");
        res.render("register", {
            defaultLayout: true,
            errorMessage: err            
        });
    });
});


// 404 error //
app.all("*", (req, res)=>{
    res.status(404).sendFile(path.join(__dirname, "/views/error.html")); 
});


dataService.initialize()
    .then(
        dataServiceAuth.initialize
    )
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log("app listening on: " + HTTP_PORT);
        }); 
    }).catch((err) => {
        console.log("Unable to start server" + err);
});

function ensureLogin (req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}