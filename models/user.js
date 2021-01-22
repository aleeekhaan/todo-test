const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true 
    }
});

const User = new mongoose.model('User', userSchema);

module.exports.userExists = userExists = (username) => {
    User.findOne({username : username}, (err, user) => {
        if(err) {
            throw err;
        }

        if(user) {
            return true;
        }
        else {
            return false;
        }
    })
}

module.exports.addUser = (newUser, callback) => {
    if(userExists(newUser.username)) {
        throw new Error("User with "+newUser.username+" already exists.");
    }
    else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash (newUser.password, salt, (err,hash) => {
                if(err) {
                    throw(err);
                }
                else{
                    newUser.password = hash;
                    newUser.save(callback);
                }
            });
        });
    }
}

module.exports.getUser = getUser = (username, callback) => {
    User.findOne({username : username}, (err, user) => {
        if(err) {
            throw err;
        }

        callback(user);
    })
}

module.exports.updateUser = updateUser = (username, updatedUser, callback) => {
    if(userExists(username)) {
        getUser(username, (user) => {
            User.findOneAndUpdate({_id : user._id}, updatedUser, (err, userUpdated) => {
                if(err) {
                    throw err;
                }
                
                userUpdated.save(callback)
            });
        })
    }
    else {
        throw new Error("Cannot update user does not exists.")
    }
    
}

module.exports.User = User