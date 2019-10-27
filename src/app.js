const path = require('path');
const express = require('express');
const app = express();

// set up epxress application
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/add', (req, res) => {
    res.render('add');
})

app.get('/list', (req, res) => {
    res.render('list');
});

app.get('/location', (req, res) => {
    res.render('location');
})

// set up map






app.listen(3000);