const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Bringing in model from mongoDB
const User = require("../models/Users");

//Login
router.get("/login", (req, res) => res.render("login"));

//Register Page
router.get("/register", (req, res) => res.render("register"));

//Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Makes sure all entry fields are filled
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Checks for password matches
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  //Check password length
  if (password.length < 6) {
    errors.push({ msg: "password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation passed on User Model
    User.findOne({ email: email }) //findOne is a function in Mongo to find one user
      .then(user => {
        if (user) {
          // User exists
          errors.push({ msg: "Email is already registered" });
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name: name, ////// long version of name = name
            email, ////// short version of email = email
            password
          });
          //Hash Password
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // Set password to hash
              newUser.password = hash;
              // Save user
              newUser
                .save() ///// .save is a mongoDb function to save to the db
                .then(user => {
                  req.flash(
                    "success_msg",
                    "You are now registered and can log in"
                  );
                  res.redirect("/users/login");
                })
                .catch(err => console.log(err));
            })
          );
        }
      });
  }
});

//login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res)=>{
req.logout();
req.flash('success_msg', 'You are now logged out');
res.redirect('/users/login');
});

module.exports = router;

