const morgan = require('morgan');
const express = require('express');
const hbs = require('express-handlebars');
const session = require('express-session');

const config = require('./config');
const PORT = 3000;

const app = express();

app.engine('hbs', hbs({ defaultLayout: 'main.hbs'}))
app.set('view engine', 'hbs');

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: config.sessionSecret,
    name: 'session_id',
    resave: true, saveUninitialized: true
}))

const getCart = (req) => {
    if (!('cart' in req.session))
        req.session.cart = {
            name: '',
            items: [ ]
        }
    return (req.session.cart)
}

app.get('/',
    (req, resp) => {
        const cart = getCart(req);
        resp.status(200).render('index', { cart })
    }
)

app.post('/cart', 
    (req, resp) => {
        const cart = getCart(req);
        cart.name = req.body.name;
        cart.items.push({
            description: req.body.description,
            quantity: parseInt(req.body.quantity)
        })
        resp.status(200).render('index', { cart })
    }
)

app.use(express.static(__dirname + '/public'))

app.listen(PORT,
    () => { console.info(`Application started on port ${PORT} at ${new Date()}`) }
);
