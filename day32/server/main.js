const morgan = require('morgan');
const mysql = require('mysql');
const MongoClient = require('mongodb').MongoClient
const express = require('express');
const hbs = require('express-handlebars');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const config = require('./config');
const mongoUrl = require('/opt/tmp/keys/config').atlas.url;
const mkQuery = require('./dbutil');

const PORT = 3000;
const pool = mysql.createPool(config);

const client = new MongoClient(mongoUrl, { useUnifiedTopology: true })

const FIND_USER = 'select count(*) as user_count from users where username = ? and password = sha2(?, 256)';
const GET_USER_DETAILS = 'select username, email, department from users where username = ?';
const GET_ALL_CUSTOMERS = 'select * from customers';

const findUser = mkQuery(FIND_USER, pool);
const getUserDetails = mkQuery(GET_USER_DETAILS, pool);
const getAllCustomers = mkQuery(GET_ALL_CUSTOMERS, pool);
const authenticateUser = (param) => {
    return (
        findUser(param)
            .then(result => (result.length && result[0].user_count > 0))
    )
}

// Load passport and LocalStrategy
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        (username, password, done) => {
            authenticateUser([ username, password ])
                .then(result => {
                    if (result)
                        return (done(null, username))
                    done(null, false);
                })
        }
    )
);

const app = express();

app.engine('hbs', hbs({ defaultLayout: 'main.hbs'}))
app.set('view engine', 'hbs');

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(passport.initialize())

app.get('/status/:code',
    (req, resp) => {
        // need to do a little more checking
        resp.status(parseInt(req.params.code)).json({ message: 'incorrect login' })
    }
)

app.get('/customers',
    (req, resp, next) => {
        console.info('user: ', req.user);
        const authorization = req.get('Authorization');
        if (!(authorization && authorization.startsWith('Bearer ')))
            return resp.status(403).json({ message: 'not authorized' })

        const tokenStr = authorization.substring('Bearer '.length)
        client.db('stuff').collection('jwt_tokens').find({ jwt: tokenStr })
            .toArray()
            .then(result => {
                if (result.length) {
                    console.info('found token')
                    req.jwt = result[0].token;
                    return next()
                }
                try {
                    console.info('not found: ')
                    req.jwt = jwt.verify(tokenStr, config.sessionSecret);
                    client.db('stuff').collection('jwt_tokens').insertOne(
                        {
                            name: req.jwt.sub,
                            jwt: tokenStr,
                            token: req.jwt
                        }
                    ).then(result => next())
                } catch (e) {
                    return resp.status(401).json({ message: 'invalid token' })
                }
            })
    },
    (req, resp) => {
        console.info('token: ', req.jwt);
        getAllCustomers()
            .then(result => {
                resp.status(200).json(result);
            })
    }
)

app.post('/authenticate', 
    passport.authenticate('local', {
        failureRedirect: '/status/401',
        session: false
    }),
    (req, resp) => {
        // issue the JWT
        getUserDetails([ req.user ])
            .then(result => {
                const d = new Date()
                const rec = result[0];
                const token = jwt.sign({
                    sub: rec.username,
                    iss: 'day32-app',
                    iat: d.getTime()/1000,
                    // 15 mins
                    exp: (d.getTime()/1000) + (60 * 15),
                    data: {
                        email: rec.email,
                        department: rec.department
                    }
                }, config.sessionSecret)
                resp.status(200).json({ token_type: 'Bearer', access_token: token })
            })
    }
)

app.get([ '/', '/login' ], (req, resp) => {
    resp.status(200).type('text/html').render('index')
});

app.use(express.static(__dirname + '/public'))

client.connect((err, _) => {
    if (err) {
        console.error('>> error: ', err);
        process.exit(-1);
    }
    app.listen(PORT,
        () => { console.info(`Application started on port ${PORT} at ${new Date()}`) }
    );
})
