var express = require("express");
var router = express.Router();
var Categories = require("./../modal/Categories.js");
const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitize } = require("express-validator/filter");
var helpers = require("./../helpers/utilitieshelper");
var moment = require("moment");
const multer = require("multer");


var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/uploads/category"); // set the destination
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + ".jpg"); // set the file name and extension
  }
});
var upload = multer({ storage: storage });

router.post("/addCategory",[
    check("category", "Category cannot be left blank").isLength({ min: 4 }),
    check("slug", "slug cannot be left blank").isLength({ min: 4 }),
   
  ],
  function(req, res, next) {
    var categoy = req.body.category;
    var slug = req.body.slug;
    var parentcategory = req.body.parentcategory;
    var document = {
      category_name: categoy,
      slug: slug,
      parentId: parentcategory
    };
    Categories.create(document, function(err, doc) {
      if (err) {
        res.json({ status: "faild", message: "" + err.message });
      } else {
        res.json({
          status: "success",
          message: "Congratulations category created successfully."
        });
      }
    });
  }
);
router.get("/getCategory", function(req, res, next) {
  
  Categories.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "parentId",
        foreignField: "_id",
        as: "parentId_doc"
      }
    }
  ]).exec((err, doc) => {
    if (err) throw err;
    res.json({ status: "success", data: doc });
  });
});

router.get("/searchCategory", function(req, res, next) {
  var term = req.query["term"];
  if (term) {
    Categories.find(
      { category_name: { $regex: ".*" + term + ".*", $options: "i" } },
      function(err, result) {
        if (err) return res.send(err);
        res.json({ status: "success", data: result });
      }
    );
  } else {
    Categories.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "parentId",
          foreignField: "_id",
          as: "parentId_doc"
        }
      }
    ]).exec((err, doc) => {
      if (err) throw err;
      res.json({ status: "success", data: doc });
    });
  }
});

router.get("/editCategory/:id", function(req, res, next) {
  Categories.findOne(
    {
      _id: req.params.id
    },
    function(err, data) {
      if (err) return res.send(err);
      res.json({ status: "success", data: data });
    }
  );
});

router.post("/updateCategory", function(req, res, next) {
  var categoy = req.body.category;
  var slug = req.body.slug;
  var parentcategory = req.body.parentcategory;
  var document = {
    category_name: categoy,
    slug: slug,
    parentId: parentcategory
  };
  var id = req.body._id;
  Categories.update({ _id: id }, document, function(err, raw) {
    if (err) throw err;
    res.json({
      message: "Information updated successfully",
      status: "success"
    });
  });
});

router.get("/getParentcategory/:id", function(
  req,
  res,
  next
) {
  Categories.findOne(
    {
      _id: req.params.id
    },
    function(err, data) {
      if (err) return res.send(err);
      if (data)
        if (data.category_name != "") {
          data = data.category_name;
        } else {
          data = "N/L";
        }
      res.json({ status: "success", data: data });
    }
  );
});

router.get("/deleteCategory/:id", function(req, res, next) {
  Categories.remove(
    {
      _id: req.params.id
    },
    function(err, user) {
      if (err) return res.send(err);
      res.json({
        status: "success",
        message: "Congratulations category deleted successfully."
      });
    }
  );
});

module.exports = router;
