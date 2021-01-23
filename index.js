const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const db = require('./config/database');

const port = 3000;
const app = express();

try {
    mongoose.connect(db.url, db.options);
    mongoose.connection.on('connected', () => {
        console.log("Connected to "+db.url);
    })
    mongoose.connection.on('error', (err) => {
        console.log(err);
    })

    const users = require('./routes/users');

    app.use(bodyParser.json())
    app.use(cors());
    app.use(passport.initialize());
    app.use(passport.session());
    require('./config/passport')(passport);

    app.use('/users', users);

    app.listen(port, ()=>{
        console.log("Server listening at port "+port);
    })
}
catch (err) {
    // console.error(err)
}
