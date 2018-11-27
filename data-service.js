
// global variable that informs us of which object we are updating 
//[[ set by getEmployeeByNum and used in updateEmployee ]]
let editNum = ""; 
let editDep = "";

const Sequelize = require("sequelize");

let sequelize = new Sequelize("d5ev5hqmr5ct5a", "ujeibmbnulivdy", 
"ad6b5d384415c26a40c1ed381ca9ed9b44cb25ca0eac59e616e55b678da6a31a", {
    host: "ec2-54-235-193-0.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
        ssl:true
    },
    operatorsAliases: false
});


sequelize
    .authenticate()
    .then(function() {
        console.log("Connection has been established successfully");
    })
    .catch(function(err) {
        console.log("Unable to connect to the database:", err);
    });

var Employee = sequelize.define("Employee", {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager:  Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status:  Sequelize.STRING,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define("Department", {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName:Sequelize.STRING
});

Department.hasMany(Employee, {foreignKey: 'department'});



/* ////////////////////////////////////////////////////////////////////////////////
    Read files  
        fs.readFile('filename', function() {});
    Create files 
        fs.appendFile('filename', 'textToAdd', function(){});  
        fs.open('filename', 'flag', function() {});  
        fs.writeFile('filename', 'textToWrite', function(){});
    Update files
        fs.appendFile('filename', 'textToAdd', function(){});  
        fs.writeFile('filename', 'textToWrite', function(){});
    Delete files
        fs.unlink('filename', function() {});
    Rename files
        fs.rename('filename', 'newFilename', function(){});

    open flags 'w' = writing
*//////////////////////////////////////////////////////////////////////////////

// Initialize() - 
module.exports.initialize = function() {   
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(()=> {
            resolve("database is a go");
        }).catch(() => {
            reject("unable to sync the database");
        });
    });
} // end of initialize


//getAllEmployees() ** REVISED DB **** A5
module.exports.getAllEmployees = function() {
    //console.log("%%%%%%%%  Called getAllEmployees()  %%%%%%%%%%");
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(()=> {
            Employee.findAll()
            .then((employees) => {
                resolve(employees);
            }).catch(() => {
                reject("no results returned");
            }); 
        }).catch(() => {
            console.log("something went wrong");
        });
    });
}

//getDepartments() ** REVISED DB **** A5 
module.exports.getDepartments = function() {
    //console.log("%%%%%%%%  Called getDepartments()  %%%%%%%%%%");
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(()=> {
            Department.findAll()
            .then((departments) => {
                resolve(departments);
            }).catch(() => {
                reject("no results returned");
            });
        }).catch(() => {
            console.log("something went wrong");
        });
    });
}

//addEmployee() 
module.exports.addEmployee = function(employeeData) {
    //console.log(" ++++++++++++  Called AddEmployee() wiht department = :" + employeeData.department + "     +++++++++++");
   employeeData.isManager = (employeeData.isManager)? true : false; 
   for (let key in employeeData ) { 
        if (employeeData[key] === "") {
            employeeData[key] = null;
        }      
    }         
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(()=> {
            //console.log("Sync was successful, employeeData to add is:  XXXX");
            //console.log(employeeData);
            Employee.create({
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager:  employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            }).then(() => { 
                //console.log("resolved with employee created sucessfully");           
                resolve("employee created sucessfully");
            }).catch(() => {
                //console.log("rejected with unable to create employee"); 
                reject("unable to create employee");
            });        
        }).catch(() => {
            console.log("something went wrong");
        }); 
    });   
}

// getEmployeesByStatus ** REVISED DB **** A5
module.exports.getEmployeesByStatus = function(status) {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(()=> {
            Employee.findAll({
                where: {
                    status: status
                }
            }).then((employees) => {
                resolve(employees);
            }).catch(() => {
                reject("no results returned");
            });
        });
    });
}

// getEmployeesByDepartment ** REVISED DB **** A5
module.exports.getEmployeesByDepartment = function(department) {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(()=> {
            Employee.findAll({
                where: {
                    department: department
                }
            }).then((employees) => {
                resolve(employees);
            }).catch(() => {
                reject("no results returned");
            });
        }).catch(() => {
            console.log("something went wrong");       
        });
    });   
}


// getEmployeesByManager ** REVISED DB **** A5
module.exports.getEmployeesByManager = function(manager) {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(()=> {
            Employee.findAll({
                where: {
                    employeeManagerNum: manager
                }
            }).then((employees) => {
                resolve(employees);
            }).catch(() => {
                reject("no results returned");
            });
        }).catch(() => {
            console.log("something went wrong");    
        });
    });
}

// getEmployeesByNum ** REVISED DB **** A5
module.exports.getEmployeeByNum = function(num) {
    editNum = num;
    //console.log("$$$$$$$ getEmployeeByNum, and num is: " + num + "  $$$$$$$$$");
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(()=> {
            //console.log("we still have the nuuuuuuuuuuuum: " + num);
            Employee.findOne({
                where: {
                    employeeNum: num
                }
            }).then((employee) => {
                //console.log("----eeeeeeeeeeeee   employee for the queried number is eeeeeeeeeeeeeeeeeeee:" + employee.firstName + " !!");
                resolve(employee);
            }).catch(() => {
                reject("no results returned");
            });
        }).catch(() => {
            console.log("something went wrong");    
        });
    });
}

// updateEmployee ** REVISED DB **** A5
module.exports.updateEmployee = function(employeeData) {
    //console.log(" ((((((((((((((((  Called updateEmployee()  )))))))))))))))))))))))))))))))) with data: ");
    //console.log(employeeData);
    employeeData.isManager = (employeeData.isManager)? true : false; 
    for (let key in employeeData ) { 
         if (employeeData[key] === "") {
             employeeData[key] = null;
         }      
     }  
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(() => {
            //console.log("(((((((((((( inside updateEmployee, the data is:  ");
            console.log(employeeData);
            Employee.update({
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager:  employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
                }, {
                where: {employeeNum: editNum}     
            }).then(() => {
                resolve("employee updated sucessfully");
            }).catch(() => {
                reject("unable to update employee");
            });
        }).catch(() => {
        console.log("something went wrong");    
        });
    }); 
} 

// addDepartment ** NEW **** A5
module.exports.addDepartment = function(department) {
    department.isManager = (department.isManager) ? true : false; 
    for (let key in department ) { 
        if (department[key] === "") {
            department[key] = null;
        }
    }
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(() => {
            Department.create({
                departmentName: department.departmentName
            }).then(() => {
                resolve("department created sucessfully");
            }).catch(() => {
                reject("unable to create department");      
            });
        }).catch(() => {
            console.log("something went wrong");
        }); 
    });
}

// getDepartmentByID ** NEW **** A5
module.exports.getDepartmentById = function(num) {
    editDep = num;
    //console.log("$$$$$$$ getDepartmentById, and num is: " + num + "  $$$$$$$$$");
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(()=> {
            Department.findOne({
                where: {
                    departmentId: num
                }
            }).then((department) => {
                resolve(department);
            }).catch(() => {
                reject("no results returned");
            });
        }).catch(() => {
            console.log("something went wrong");    
        });
    });
}

// updateDepartment ** NEW **** A5
module.exports.updateDepartment = function(department) {
    department.isManager = (department.isManager) ? true : false; 
    for (let key in department ) { 
        if (department[key] === "") {
            department[key] = null;
        }
    }
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(() => {
            Department.update({
                departmentName: department.departmentName
            }, {
                where: {
                    departmentId: editDep
                }
            }).then(() => {
                resolve("department updated sucessfully");
            }).catch(() => {
                reject("unable to update department");      
            });
        }).catch(() => {
            console.log("something went wrong");
        }); 
    });
}



// deleteDepartmentById ** NEW **** A5
module.exports.deleteDepartmentById = function(num) {
    //console.log("*************  Deleting Department with Id Number: " + num + "****************");   
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(()=> {
            Department.destroy({
                where: {
                    departmentId: num
                }
            }).then(() => {
                resolve("department was deleted successfully");
            }).catch(() => {
                reject("unable to delete department");
            });
        }).catch(() => {
            console.log("something went wrong");    
        });
    });
}

// deleteEmployeeByNum 
module.exports.deleteEmployeeByNum = function(num) {
    //console.log("*************  Deleting employee with Id Number: " + num + "****************");
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(()=> {
            Employee.destroy({
                where: {
                    employeeNum: num
                }
            }).then(() => {
                resolve("employee was deleted successfully");
            }).catch(() => {
                reject("unable to delete employee");
            });
        }).catch(() => {
            console.log("something went wrong");    
        });
    });
}

