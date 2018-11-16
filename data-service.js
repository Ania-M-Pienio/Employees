
let editNum = "";

var sequelize = new Sequelize("d5ev5hqmr5ct5a", "ujeibmbnulivdy", "ad6b5d384415c26a40c1ed381ca9ed9b44cb25ca0eac59e616e55b678da6a31a", {
    host: "ec2-54-235-193-0.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
        ssl:true
    }
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


/*

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

*/

// Initialize() - reads ./data/employees.json
module.exports.initialize = function() {   
    return new Promise(function (resolve, reject) {
        reject();
});

} // end of initialize



//getAllEmployees()
module.exports.getAllEmployees = function() {
    return new Promise(function (resolve, reject) {
        reject();
    });
}

//getDepartments()
module.exports.getDepartments = function() {
    return new Promise(function (resolve, reject) {
        reject();
    });
}

//getManagers() 
module.exports.getManagers = function() {
    return new Promise(function (resolve, reject) {
        reject();
    });
}

//addEmployees() 
module.exports.addEmployee = function(employeeData) {
    return new Promise(function (resolve, reject) {
        reject();
    });
}

// getEmployeesByStatus
module.exports.getEmployeesByStatus = function(status) {
    return new Promise(function (resolve, reject) {
        reject();
    });
}

// getEmployeesByDepartment
module.exports.getEmployeesByDepartment = function(department) {
    return new Promise(function (resolve, reject) {
        reject();
    });   
}


// getEmployeesByManager
module.exports.getEmployeesByManager = function(manager) {
    return new Promise(function (resolve, reject) {
        reject();
    });
}

// getEmployeesByNum
module.exports.getEmployeeByNum = function(num) {
    editNum = num; // stores which employeeNum is being currently recalled (for use if employee is edited)
    return new Promise(function (resolve, reject) {
        reject();
    });
}

// updateEmployee
module.exports.updateEmployee = function(employeeData) {
    return new Promise(function (resolve, reject) {
        reject();
    });
}