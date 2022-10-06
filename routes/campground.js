const express = require("express");

const router = express.Router();
const multer = require("multer");
const catchAsync = require("../utils/catchAsync");

const Campground = require("../models/campground"); // db schema

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

const { storage } = require("../cloudinary");

const upload = multer({ storage });

const campgrounds = require("../controllers/campgrounds");

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );
// .post(upload.array("image"), function (req, res) {
//   console.log(req.body, req.files);
//   res.send("IT WORKED!?");
// });

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
