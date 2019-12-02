
const morgan = require('morgan');
const mysql = require('mysql');
const express = require('express');
const protected = require('./protected');

const config = require('./config');
const mkQuery = require('./dbutil');

const PORT = 3000;
const pool = mysql.createPool(config);

const FIND_USER = 'select count(*) as user_count from users where username = ? and password = sha2(?, 256)';
const GET_USER_DETAILS = 'select username, email, department from users where username = ?';
const findUser = mkQuery(FIND_USER, pool);
const getUserDetails = mkQuery(GET_USER_DETAILS, pool);
const authenticateUser = (param) => {
    return (
        findUser(param)
            .then(result => (result.length && result[0].user_count > 0))
    )
}

// add express-session
const session = require('express-session');
// load Passport
const passport = require('passport');
// load one or more strategies
const LocalStrategy = require('passport-local').Strategy;
// Configure passport to use LocalStrategy
passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    // authenticate - callback
    (req, user, pass, done) => {
        console.info(`user: ${user}, pass: ${pass}`);
        authenticateUser([ user, pass ])
            .then(result => {
                console.info('after authentication: ', result)
                req.authenticated = result;
                if (result) {
                    req.loginAt = new Date();
                    // authenticated
                    return done(null, user)
                }
                // incorrect username/password
                done(null, false);
            })
            .catch(error => {
                console.error('authentication db error: ', error);
                done(null, false)
            })
    }
))
// serialize user 
// save the user to the session -> create session_id cookie
passport.serializeUser(
    (user, done) => {
        console.info('** Serialize user: ', user)
        done(null, user);
    }
)
// deserialize user 
// retrieve the user profile from database and pass it to passport
// passport will attach the user details to req.user
passport.deserializeUser(
    (user, done) => {
        console.info('++ Deserialize user: ', user)
        getUserDetails([ user ])
            .then(result => {
                console.info('result from deserialize ', result)
                if (result.length)
                    return done(null, result[0])
                done(null, user)
            })
    }
)

const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));

// Configure session support for express
// must be before initialize()
app.use(session({
    secret: config.sessionSecret,
    name: 'session_id', // session name -> cookie name
    resave: true,
    saveUninitialized: true
}))

// Add passport to the request route
// Must be after urlencoded
app.use(passport.initialize())
// Get passport to use session
app.use(passport.session())

app.use('/secure', 
    (req, resp, next) => {
        console.info('user = ', req['user']);
        if (req['user'])
            return next()
        resp.redirect(301, '/index.html');
    },
    protected());

app.post('/authenticate',
    // Use LocalStrategy to authenticate
    passport.authenticate('local', { 
        successRedirect: '/success.html',
        failureRedirect: '/error.html'
    })
)

app.use(express.static(__dirname + '/public'))

app.listen(PORT,
    () => { console.info(`Application started on port ${PORT} at ${new Date()}`) }
);