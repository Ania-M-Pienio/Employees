const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

/*[ 1 ]*/ //CREATE SCHEMA
var userSchema = new Schema ({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": 
    [{
        "dateTime": Date,
        "userAgent": String
    }]
  });

let User;  // *[ 2 ]* // CREATE EMPTY OBJECT CALLED USER

// Auth Initialize // Connect Database
module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
  /*[ 3 ]*/ //CONNECT TO DATABASE
        let db = mongoose.createConnection("mongodb://A6:ArtDecco6@ds263639.mlab.com:63639/web322_a6", { 
            useCreateIndex: true,
            useNewUrlParser: true
        });
      
        // authentication failed
        db.on('error', (err) => {
            reject(err);
        });
        // authentication succeeded
        // *[ 3 ]* // POPULATE USER WITH 
        db.once('open', () => {
            User = db.model("users", userSchema); 
            resolve();
        });
    }); // end of promise
} // end of function


// registerUser()
module.exports.registerUser = function(userData) {
    return new Promise ((resolve, reject) => {
        if (userData.password != userData.password2) {
            reject("Passwords do not match");
        } else {
            let newUser = new User({
                "userName": userData.userName,
                "password": userData.password,
                "email": userData.email        
            });
            newUser.save((err) => {
                if(err == 11000) { // 11000 = duplicate key
                    reject("User Name already taken");
                } else if (err) {
                    reject("There was an error creating the user: " + err);
                } else {
                    resolve();
                } // else 2
            }); //  end of save newUser
        } // else 1
    }); // end of promise

} // end of function

// checkUser()
module.exports.checkUser = function(userData) {
    console.log(" --------- checkUser -----------------");
    console.log(" ----- userData --------");
    console.log(userData);
    return new Promise ((resolve, reject) => {
         User.findOne({
             userName: userData.userName
        })
        .exec()
        .then((results) => {
            console.log(" --------- checkUser + THEN -----------------");
            console.log(" ----- results --------");
            console.log(results);
            if (results.userName.length == 0) {
                console.log(" --------- checkUser + THEN + no users returned -----------------");
                reject("Unable to find user: " + userData.userName);                
            } else if (userData.password != results.password) {
                console.log(" --------- checkUser + THEN + password no good -----------------");
                reject("Incorrect Password for user: " + userData.userName);
            } else {
                console.log(" --------- checkUser + THEN + HistoryPush -----------------");
                results.loginHistory.push({
                    dateTime: (new Date()).toString(), 
                    userAgent: userData.userAgent                       
                });
                console.log("----- loginHistory -----")
                console.log(results.loginHistory);
                User.updateOne({ userName: userData.userName }, 
                    { $set: { loginHistory: results.loginHistory }})
                .exec()
                .then(() => {
                    console.log("----- resolved updateOne -----");
                    resolve(results);
                })
                .catch(() => {
                    reject("There was an error verifying the user: " + userData.userName);
                }); // end of updateOne
            } // end of else1
        })
        .catch((err) => {
            console.log(" --------- checkUser + CATCH -----------------");
            reject("Unable to find user: " + userData.userName + err)
        }); //end of findOne   
    }); // end of promise
} // end of function
      
  
