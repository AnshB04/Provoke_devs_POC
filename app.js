// app.js

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const session = require('express-session');
const User = require('./models/user');
const authRouter = require('./routes/auth');
const plansRouter = require('./routes/plans');
const subscriptionsRouter = require('./routes/subscriptions');
const app = express();

mongoose.connect('mongodb://localhost/myapp');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'myapp', resave: false, saveUninitialized: false }));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRouter);
app.use('/plans', plansRouter);
app.use('/subscriptions', subscriptionsRouter);

app.listen(3000, () => console.log('Server is running on port 3000'));