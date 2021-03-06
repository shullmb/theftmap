require('dotenv').config();
const express = require('express');
const layout = require('express-ejs-layouts');
const bp = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/passportConfig');

const port = process.env.PORT || 3001;

const app = express();

app.set('view engine', 'ejs');
app.use(layout);
app.set("layout extractScripts", true);

app.use(express.static(__dirname + '/public'));
app.use(bp.urlencoded({extended: false}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use( (req, res, next) => {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
})


// GET / 
app.get('/', (req,res) => {
    // this use of locals is specific to express-ejs-layouts
    let locals = {title: 'Welcome to THFTMPPR'}
    res.render('index', locals);
})

app.use('/auth', require('./controllers/auth'));
app.use('/maps', require('./controllers/maps'));

const server = app.listen(port, () => {
    console.log("\x1b[35m\x1b[3m%s\x1b[0m",`*** server running on ${port} ***`);
})

module.exports = server;