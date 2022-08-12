const express = require("express");
const cors = require("cors");
const router = express.Router();

// Models
let Targets = require("../models/Targets");
let Operations = require("../models/Operations");
let Users = require("../models/Users");
let Notes = require("../models/Notes");
let Posts = require("../models/Posts");
let Comments = require("../models/Comments");

// ------- Targets -------

router.get("/get_targets", (req, res) => {
  Targets.get_targets(req, res);
});

router.post("/add_target", (req, res) => {
  Targets.add_target(req, res);
});

router.delete("/remove_target", (req, res) => {
  Targets.remove_target(req, res);
});

// ------- Operations -------

router.get("/get_operations", (req, res) => {
  Operations.get_operations(req, res);
});

router.post("/add_operation", (req, res) => {
  Operations.add_operation(req, res);
});

router.delete("/remove_operation", (req, res) => {
  Operations.remove_operation(req, res);
});

// ------- Users -------

router.post("/login", (req, res) => {
  Users.login(req, res);
});

router.post("/add_user", (req, res) => {
  Users.add_user(req, res);
});

router.delete("/remove_user", (req, res) => {
  Users.remove_user(req, res);
});

// ------- Notes -------

router.get("/get_notes", (req, res) => {
  Notes.get_notes(req, res);
});

router.post("/add_note", (req, res) => {
  Notes.add_note(req, res);
});

router.delete("/remove_note", (req, res) => {
  Notes.remove_note(req, res);
});

// ------- Posts -------

router.get("/get_posts", (req, res) => {
  Posts.get_posts(req, res);
});

router.post("/add_post", (req, res) => {
  Posts.add_post(req, res);
});

router.delete("/remove_post", (req, res) => {
  Posts.remove_post(req, res);
});

// ------- Comments -------

router.get("/get_comments", (req, res) => {
  Comments.get_comments(req, res);
});

router.post("/add_comment", (req, res) => {
  Comments.add_comment(req, res);
});

router.delete("/remove_comment", (req, res) => {
  Comments.remove_comment(req, res);
});

module.exports = router;
