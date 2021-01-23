const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const user = require('../models/user');

const secret = require('../config/database').secret;

module.exports = function (passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

       console.log(jwt_payload, "a");
        user.getUser(jwt_payload.userData.username, (err, user) => {
            if(err) {
                return done(err, false);
            }

            if(user) {
                // console.log(user);
                return done(null,user);
            }
            else {
                return done(null,false);
            }
        });
    }));
};
