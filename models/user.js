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

module.exports.User = User = new mongoose.model('User', userSchema);

module.exports.hashPassword = hashPassword = (password, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash (password, salt, (err,hash) => {
            if(err) {
                throw(err);
            }
            else{
                callback(hash)
            }
        });
    });    
}

module.exports.comparePassword = comparePassword = async (passwordHash, candidatePass, callback) => {
    const match = await bcrypt.compare(candidatePass, passwordHash);
    callback(match);
}


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
    getUser(newUser.username, (user) => {
        if(user) {
            throw new Error("User already exists");
        }
        else {
            hashPassword(newUser.password, (hash)=>{
                newUser.password = hash;
                newUser.save(callback)
            })
        }
    });
}

module.exports.getUser = getUser = (username, callback) => {
    User.findOne({username : username}, (err, user) => {
        if(err) {
            throw err;
        }
        
        callback(user)
    })
}

module.exports.updateUser = updateUser = (username, updatedUserData, callback) => {
    User.findOneAndUpdate({username : username}, updatedUserData, (err, user) => {
        if (err) {
            throw err;
        }

        if(user) {
            console.log(user);
            user.save(callback);
        }
        else {
            throw new Error("Failed to update user. User doesnot exist.")
        }
    })
}

module.exports.deleteUser = deleteUser = (username, callback) => {
    User.findOneAndDelete({username : username}, callback);
}

