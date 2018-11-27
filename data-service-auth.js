const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  })

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
            let newUser = new User(userData);
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
    return new Promise ((resolve, reject) => {
         User.find({userName: userData.userName})
        .exec()
        .then((users) => {
            if (!users.size()) {
                reject("Unable to find user: " + userData.userName);
            } else if (userData.password != users[0].password) {
                reject("Incorrect Password for user: " + userData.userName);
            } else {
                users[0].loginHistory.push({
                    dateTime: (new Date()).toString(), 
                    userAgent: userData.userAgent                       
                });
                User.updateOne({
                    userName: userData[0].userName
                }, {
                    $set: { loginHistory: users[0].loginHistory }
                })
                .exec()
                .then(() => {
                    resolve(users[0]);
                })
                .catch(() => {
                    reject("There was an error verifying the user: " + userData.userName);
                }); // end of updateOne
            } // end of else1
        })
        .catch((err) => {
            reject("Unable to find user: " + userData.userName)
        }); //end of findOne   
    }); // end of promise
} // end of function
      
  
