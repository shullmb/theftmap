require('dotenv').config();
const express = require('express');
const layout = require('express-ejs-layouts');
const bp = require('body-parser');

const port = process.env.PORT || 3001;

const app = express();

app.set('view engine', 'ejs');
app.use(layout);
app.use(express.static(__dirname + '/public'));
app.use(bp.urlencoded({extended: false}));

// GET / 
app.get('/', (req,res) => {
    res.render('index');
})

app.use('/auth', require('./controllers/auth'));

const server = app.listen(port, () => {
    console.log(`*** server running on ${port} ***`);
})

module.exports = server;