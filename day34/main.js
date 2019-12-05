const express = require('express')
const hbs = require('express-handlebars')
const morgan = require('morgan');
const Octokit = require('@octokit/rest');

const PORT = 3000;
const config = require('./config');

const db = {};

// setup passport
const session = require('express-session');
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;

passport.use(new GithubStrategy(
    {
        ...config,
        passReqToCallback: true
    },
    (req, accessToken, refreshToken, profile, done) => {
        console.info('accessToken: ', accessToken)
        console.info('refreshToken: ', refreshToken)
        console.info('profile: ', profile)
        // Save to database
        db[profile.username] = accessToken;
        done(null, profile)
    }
));
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    name: 'github_session',
    secret: 'TERCES',
    resave: true, saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.post('/register',
    passport.authenticate('github', { scope: [ 'gist' ]})
)

app.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/error.html' } ),
    (req, resp) => {
        console.info('user: ', req.user);
        resp.redirect('/content.html');
    }
)

app.get('/repos',
    (req, resp) => {
        const token = db[req.user.username]
        console.info('token: ', token)
        const okto = Octokit({
            auth: token,
            userAgent: 'day34_snmf_app v1.alpha'
        })
        okto.repos.list()
            .then(result => {
                console.log('result: ', result)
                resp.status(200).send('<h1>Done</h1>')
            })
            .catch(error => {
                console.error('error: ', error)
                resp.status(200).send('<h1>Done</h1>')
            })
    }
)

app.post('/create-gist',
    (req, resp) => {
        const token = db[req.user.username]
        console.info('token: ', token)
        const okto = Octokit({
            auth: token,
            userAgent: 'day34_snmf_app v1.alpha'
        })
        const d = new Date();
        const files = {}
        files[`file-${d.getTime()}.txt`] = {
            content: req.body.gistContent
        }
        console.info('files: ', files)
        okto.gists.create({
            files: files,
            description: `Gist created on ${d.toISOString()}`,
            public: true
        })
            .then(result => {
                console.info('gist: ', result);
                resp.status(201).send('Gist created');
            })
            .catch(error => {
                console.error('gist error: ', error)
                resp.status(400).send(JSON.stringify(error))
            })

    }
)

app.use(express.static(__dirname + '/public'));

app.listen(PORT,
    () => {
        console.info(`Application started on ${PORT} at ${new Date()}`);
    }
)
