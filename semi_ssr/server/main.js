const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const session = require('express-session');

const PORT = parseInt(process.env.APP_PORT || process.env.PORT) || 3000;
const SECRET = 'TERCES';

passport.use(new LocalStrategy(
	{
		usernameField: 'username',
		passwordField: 'password'
	},
	(username, password, done) => {
		console.info(`username: ${username}, password: ${password}`);
		if (username == password)
			return done(null, username);
		done(null, false);
	}
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		name: 'sess_id', secret: SECRET,
		resave: true, saveUninitialized: true
	})
)

app.use(passport.initialize());
app.use(passport.session());


app.get('/status/:code',
	(req, resp) => {
		resp.status(parseInt(req.params.code)).json({ message: 'error' })
	}
)

app.get('/customers',
	(req, resp, next) => {
		console.info('user: ', req.user)
		console.info('session: ', req.session)
		const bearer = req.get('Authorization');
		if (!(bearer && bearer.startsWith('Bearer ')))
			return resp.status(401).json({ message: 'not authorized' });
		const token = bearer.substring('Bearer '.length);
		console.info('token: ', token)
		try {
			jwt.verify(token, SECRET)
		} catch (err) {
			console.error('>>> err: ', err);
			return resp.status(401).json({ message: 'not authorized' });
		}
		next();
	},
	(req, resp) => {
		resp.status(200).json([ 'fred', 'barney', 'betty', 'wilma' ]);
	}
)

app.get('/angular', 
	(req, resp) => {
		let url = '/client'
		if (req.session.token)
			url = `${url}?access_token=${req.session.token}`
		resp.redirect(url);
	}
)

app.post('/authenticate',
	passport.authenticate('local', { failureRedirect: '/status/:code' }),
	(req, resp) => {
		const token = jwt.sign(
			{ 
				sub: req.user, 
				exp: (new Date()).getTime()/1000 + (60 * 15)
			}, SECRET);
		req.session.token = token

		resp.format({
			'text/html': () => {
				resp.redirect(`/client?access_token=${req.session.token}`)
			},
			'application/json': () => {
				resp.status(200).json({
					token_type: 'Bearer',
					access_token: token
				})
			},
			'default': () => {
				resp.redirect(`/client?access_token=${req.session.token}`)
			}
		})
	}
)

app.use(express.static(__dirname + '/public'));
app.use('/client', express.static(__dirname + '/../client/dist/client'));

app.listen(PORT,
	() => {
		console.info(`Application started on ${PORT} at ${new Date()}`);
	}
)
