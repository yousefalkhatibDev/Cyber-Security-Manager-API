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
  Targets.GetTargets(req, res);
});

router.post("/add_target", (req, res) => {
  Targets.AddTarget(req, res);
});

router.delete("/remove_target", (req, res) => {
  Targets.RemoveTarget(req, res);
});

router.put("/update_target_name", (req, res) => {
  Targets.UpdateName(req, res);
});

router.put("/update_target_type", (req, res) => {
  Targets.UpdateType(req, res);
});

router.put("/update_target_description", (req, res) => {
  Targets.UpdateDescription(req, res);
});

router.put("/update_target_location", (req, res) => {
  Targets.UpdateLocation(req, res);
});

// ------- Operations -------

router.get("/get_operations", (req, res) => {
  Operations.GetOperations(req, res);
});

router.post("/add_operation", (req, res) => {
  Operations.AddOperation(req, res);
});

router.delete("/remove_operation", (req, res) => {
  Operations.RemoveOperation(req, res);
});

router.put("/update_operation_description", (req, res) => {
  Operations.UpdateDescription(req, res);
});

router.put("/update_operation_name", (req, res) => {
  Operations.UpdateName(req, res);
});

router.put("/update_operation_state", (req, res) => {
  Operations.UpdateState(req, res);
});

// ------- Users -------

router.post("/login", (req, res) => {
  Users.Login(req, res);
});

router.post("/add_user", (req, res) => {
  Users.AddUser(req, res);
});

router.delete("/remove_user", (req, res) => {
  Users.RemoveUser(req, res);
});

router.put("/update_user_email", (req, res) => {
  Users.UpdateEmail(req, res);
});

router.put("/update_user_name", (req, res) => {
  Users.UpdateName(req, res);
});

router.put("/update_user_bio", (req, res) => {
  Users.UpdateBio(req, res);
});

// ------- Notes -------

router.get("/get_notes", (req, res) => {
  Notes.GetNotes(req, res);
});

router.post("/add_note", (req, res) => {
  Notes.AddNote(req, res);
});

router.delete("/remove_note", (req, res) => {
  Notes.RemoveNote(req, res);
});

// ------- Posts -------

router.get("/get_posts", (req, res) => {
  Posts.GetPosts(req, res);
});

router.post("/add_post", (req, res) => {
  Posts.AddPost(req, res);
});

router.delete("/remove_post", (req, res) => {
  Posts.RemovePost(req, res);
});

// ------- Comments -------

router.get("/get_comments", (req, res) => {
  Comments.GetComments(req, res);
});

router.post("/add_comment", (req, res) => {
  Comments.AddComment(req, res);
});

router.delete("/remove_comment", (req, res) => {
  Comments.RemoveComment(req, res);
});

module.exports = router;
