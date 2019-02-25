const express = require('express');
const app = express();
expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose')

//DB config
const db = require('./config/keys').mongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
.then(()=>console.log('MongoDB Connected...'))
.catch(err=> console.log(err));
//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));