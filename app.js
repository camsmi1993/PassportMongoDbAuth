const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')

// Passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').mongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
.then(()=>console.log('MongoDB Connected...'))
.catch(err=> console.log(err));
//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BodyParser middle wear
app.use(express.urlencoded({extended: false}));

// Express Session middle wear

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash middle wear
app.use(flash());

// Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});


//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));