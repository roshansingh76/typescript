var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");

var User = require("./../modal/User.js");

let jwt = require('jsonwebtoken');
var config = require('./../config/config');
const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitize } = require("express-validator/filter");
var helpers = require("./../helpers/utilitieshelper");
router.post(
  "/createUser",
  [
    check("full_name", "Full name cannot be left blank").isLength({ min: 1 }),
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .trim()
      .normalizeEmail()
      .custom(value => {
        return findUserByEmail(value).then(User => {
          //if user email already exists throw an error
          // throw new Error("Email Already exits");
        });
      }),

    check("password")
      .isLength({ min: 7 })
      .withMessage("Password must be at least 7 chars long with number")
      .matches(/\d/)
      .withMessage("Password must contain one number")
      .custom((value, { req, loc, path }) => {
        if (value !== req.body.cpassword) {
          console.log(vale);
          return false;
          res.json({ status: "faild", msg: "Passwords don't match" });
        } else {
          return value;
        }
      })
  ],
  function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ status: "faild", message: errors.array() });
    } else {
      var document = {
        full_name: req.body.full_name,
        email: req.body.email,
        password: req.body.cpassword
      };
      var user = new User(document);
      user.save(function(error) {
        if (error) {
          throw error;
        }
        res.json({
          status: "success",
          msg:
            "Your account created successfully. Please verified your email id"
        });
      });
    }
  }
);


router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .trim()
      .normalizeEmail(),
	  check("password")
      .isLength({ min: 1 })
      .withMessage("Password is required.")
  ],
  function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ status: "faild", message: errors.array() });
    } else {
		 let username = req.body.email;
		let password = req.body.password;
	
		// For the given username fetch user from DB
		let mockedUsername = 'admin@admin.com';
		let mockedPassword = '123456';

		if (username && password) {
			if (username === mockedUsername && password === mockedPassword) {
			
			let token = jwt.sign({username: username},
			  config.secret,
			  { expiresIn: '24h' // expires in 24 hours
			  }
			);
			// return the JWT token for the future API calls
			res.json({
			  success: true,
			  message: 'Authentication successful!',
			  token: token
			});
		  } else {
			res.send(403).json({
			  success: false,
			  message: 'Incorrect username or password'
			});
		  }
		} else {
		  res.send(400).json({
			success: false,
			message: 'Authentication failed! Please check the request'
		  });
		}
		}
  }
);

router.get("/logout", function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/admin");
    }
  });
});

module.exports = router;
