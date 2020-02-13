const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

// connect to MongoDB
require('./db')
const mongoose = require('mongoose');
const Location = mongoose.model('Location');
const Report = mongoose.model('Report');
const User = mongoose.model('User');

//Reference: https://github.com/passport/express-4.x-local-example
passport.use(new LocalStrategy(
    function(username, password, verify) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return verify(err); }
        if (!user) { return verify(null, false, { message: 'Incorrect username.' }); }
        if (user.password != password) { return verify(null, false, { message: 'Incorrect password.' }); }
        else { return verify(null, user); }
      });
    }
));
passport.serializeUser(function(user, verify) {
    verify(null, user.id);
});
passport.deserializeUser(function(id, verify) {
    User.findOne({id: id}, function (err, user) {
      if (err) { return verify(err); }
      verify(null, user);
    });
});

const app = express();
// set up epxress application
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.use((req, res, next) => {
    console.log('\n===LOGGING REQUEST===');
	console.log('Method:', req.method);
	console.log('Path:', req.path);
	console.log(req.query);
	next();
});
const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
    resave: false,
    cookie: {}
};
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(flash());

const {check, validationResult} = require('express-validator');

// router

app.get('/user', (req, res) => {
    if (req.user) {
        res.redirect('/me');
    }
    else {
        res.sendFile(path.join(__dirname, 'public/user.html'));
    }
});

app.post('/user/ajax', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
    if (err) return res.status(500).send();
    if (!user) return res.status(400).json({error:info});
    req.logIn(user, function(err) {
        if (err) return next(err);
        return res.status(200).json(info);
    });
})(req, res, next);
});

app.post('/user', passport.authenticate('local', {
  successRedirect : '/me',
  failureRedirect : '/user',
  failureFlash : true
}));

app.get('/me', (req, res) => {
    if (req.user) {
        res.sendFile(path.join(__dirname, 'public/me.html'));
    }
    else {
        res.redirect('/user');
    }
});

//Reference: https://express-validator.github.io/docs/

app.post('/me', [
    check('password').isLength({min:8})
], (req, res) => {
    User.findOne({username: req.body.username}, function(err, user) {
        if (user) {
            res.status(422).json({errors: [{param: 'username'}]});
        }
        else {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
            }
            else {         
                new User({
                    username: req.body.username,
                    password: req.body.password
                }).save((err, newUser) => {
                    if (err) {
                        res.json({errors: 'Error in connecting to database'});
                    }
                //TODO log-in after sign-up
                res.json(newUser);
                });    
            }
        }
    })  
});



app.get('/map', (req, res) => {
    const query = {};
    if (req.query.campQ && req.query.campQ != 'All') {
        query.campus = req.query.campQ;
    }
    if (req.query.typeQ) {
        query.type = req.query.typeQ;
    }
    if (req.query.loctQ) {
        query.$text = { $search: req.query.loctQ }
    }

    Location.find(query, function(err, locs){
       console.log(locs.length);
       res.json(locs);    
    });    
});



app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {

    Location.find({code: req.body.location}, function(err, loc){
        new Report({
            location: loc[0],
            message: req.body.message,
            item: req.body.item
        }).save((err, newReport) => {
            if (err) {throw err;}
            res.redirect('/report')
        });
    });

});

app.get('/modify', (req, res) => {
    if (req.query.id) {
        Report.find({"id": req.query.id}, function(err, tomodify){  
            res.render('modify', tomodify[0])
        });
    }
});

app.post('/modify', (req, res) => {
    console.log(req.body);
    Location.find({code: req.body.location}, function(err, loc) {
        console.log(loc);
        const query = {"id": req.body.id}
        const updates = {
            location: loc[0],
            message: req.body.message,
            item: req.body.item
        };
        Report.finverifyAndUpdate(query, updates, function(err, updated){
            res.redirect('/report');
        });
    });
});

app.get('/report', (req, res) => {
    if (req.query.delete) {
        Report.deleteOne({"id": req.query.id}, function(err, deleted){
            console.log('delete', deleted);
            res.redirect('/report')
        });
    }
    else if (req.query.modify) {
        Report.find({"id": req.query.id}, function(err, tomodify){
                res.redirect('/modify?id=' + req.query.id);
        });
    }
    else {
        Report.find({}, function(err, reports){
            res.render('report', {reports: reports});
        })
    }

})

app.get('/explore', (req, res) => {
    const query = {};
    if (req.query.campQ && req.query.campQ != 'All') {
        query.campus = req.query.campQ;
    }
    if (req.query.typeQ) {
        query.type = req.query.typeQ;
    }
    if (req.query.loctQ) {
        query.$text = { $search: req.query.loctQ }
    }
    console.log('starting to find');
    Location.find(query, function(err, locs){
        if (err) {
            throw err;
        }
        else {
            console.log(query);
            console.log('find', locs)
            res.render('explore', {
                locations: locs,
                query: query
            });   
        }
    });
});




app.listen(process.env.PORT || 3000);





