let employees = [];
let departments = [];
let managers = [];


const fs = require('fs');
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
    fs.readFile('data/employees.json', 'utf8', (err, data) => {                   
        if (err) {
            reject("unable to read file");
        } else { // else1
            let dataJS = JSON.parse(data);
            for (let i = 0; i < dataJS.length; i++) {
                employees.push(dataJS[i]);
            }                
           fs.readFile('data/departments.json', 'utf8', (err, data2) => {
               if (err) {
                   reject("unable to read file");
               } else { // else2
                let dataJS = JSON.parse(data);
                for (let i = 0; i < dataJS.length; i++) {
                    departments.push(dataJS[i]);
                }                
                   resolve("server is a go");
               } // end of else 2

           }); // end of second read

        } // end of else1            
         
    }); // end if first read     
         
}); // end of promise

} // end of initialize



//getAllEmployees()
module.exports.getAllEmployees = function() {
    return new Promise ((resolve, reject) => {
        if (employees.length == 0) {
            reject("no results returned");
        } else {
            resolve(employees);
        }
    });
}

//getDepartments()
module.exports.getDepartments = function() {
   return new Promise ((resolve, reject) => {
        if (departments.length == 0) {
            reject("no results returned");
        } else {
            resolve(departments);
        }
    }); 
}

//getManagers() 
module.exports.getManagers = function() {
    for (let i = 0; i < employees.length; i++) {
        //          
        if (employees[i].isManager == true) {
            managers.push(employees[i]);                                         
        }
    }
    return new Promise ((resolve, reject) => {   
        if (managers.length == 0) {
            reject("no results returned");
        } else {            
            resolve(managers);
        }        
    });
}