const router = require('express').Router();
const userModel = require('../models/user').User;
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const secret = require('../config/database').secret;

router.post('/register', (req, res, next) => {
    let userdata = {
        username : req.body.username,
        name : req.body.name,
        password : req.body.password
    }

    const newUser = new userModel(userdata);

    try {
        user.addUser(newUser, ()=>{
            res.json({success : true, msg : "User registered."})
        })
    }
    catch (err) {
        res.json({success : false, msg : "Failed to register user.", err : err});
    }
});

router.post('/authenticate', (req, res, next) => {
    const candidateUser = {
        username : req.body.username,
        name : req.body.name,
        password : req.body.password
    }

    try {
        user.getUser(candidateUser.username, (userData) => {
            if (userData) {
                user.comparePassword(userData.password, candidateUser.password, (match) => {
                    if(match) {
                        const token = jwt.sign({userData}, secret, {expiresIn : 100000});
                        
                        res.json({
                            success : true,
                            msg : "User authenticated.", 
                            token : token,
                            user : {
                                username : userData.username,
                                name : userData.name
                            }
                        })
                    }
                    else {
                        throw new Error("Password doesnot match.")
                    }
                }) 
            }
            else {
                throw new Error("User doesnot exists.")
            }
        })
    }
    catch (err) {
        res.json({success : false, msg : "Failed to authenticate user.", err : err});
    }
})

router.get('/login', passport.authenticate('jwt', {session : false}),(req, res, next) => {
    const user = req.body.user;
    res.json({success : true, user : user})
})

module.exports = router;