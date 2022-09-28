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
let Auth = require("../models/Auth");
let Relations = require("../models/Relations");
let Tasks = require("../models/Tasks");
let Members = require("../models/Members");

// ------- Auth -------

router.post("/register", (req, res) => {
  Auth.Register(req, res);
});

router.post("/logout", (req, res) => {
  Auth.Logout(req, res);
});

router.post("/login", (req, res) => {
  Auth.Login(req, res);
});

// ------- Targets -------

router.post("/get_targets", (req, res) => {
  Targets.GetTargets(req, res);
});

router.post("/get_target_info", (req, res) => {
  Targets.GetTargetInfo(req, res);
});

router.post("/get_targets_by_user", (req, res) => {
  Targets.GetTargetsByUser(req, res);
});

router.post("/get_target_notes_count", (req, res) => {
  Targets.GetTargetNotesCount(req, res);
});

router.post("/add_target", (req, res) => {
  Targets.AddTarget(req, res);
});

router.post("/get_target_image", (req, res) => {
  Targets.GetTargetImage(req, res);
});

router.post("/remove_target", (req, res) => {
  Targets.RemoveTarget(req, res);
});

router.post("/update_target_info", (req, res) => {
  Targets.UpdateTargetInfo(req, res);
});

// ------- Operations -------

router.post("/get_operations", (req, res) => {
  Operations.GetOperations(req, res);
});

router.post("/get_operation_image", (req, res) => {
  Operations.GetOperationImage(req, res);
});

router.post("/get_operation_members_count", (req, res) => {
  Operations.GetOperationMembersCount(req, res);
});

router.post("/get_operation_posts_count", (req, res) => {
  Operations.GetOperationPostsCount(req, res);
});

router.post("/get_operation_targets_count", (req, res) => {
  Operations.GetOperationTargetsCount(req, res);
});

router.post("/get_operation_info", (req, res) => {
  Operations.GetOperationInfo(req, res);
});

router.post("/add_operation", (req, res) => {
  Operations.AddOperation(req, res);
});

router.post("/remove_operation", (req, res) => {
  Operations.RemoveOperation(req, res);
});

router.post("/update_operation_info", (req, res) => {
  Operations.UpdateOperationInfo(req, res);
});

router.post("/update_operation_state", (req, res) => {
  Operations.UpdateOperationState(req, res);
});

// ------- Users -------

router.post("/remove_user", (req, res) => {
  Users.RemoveUser(req, res);
});

router.post("/update_user_email", (req, res) => {
  Users.UpdateEmail(req, res);
});

router.post("/update_user_name", (req, res) => {
  Users.UpdateName(req, res);
});

router.post("/update_user_bio", (req, res) => {
  Users.UpdateBio(req, res);
});

// ------- Notes -------

router.post("/get_notes", (req, res) => {
  Notes.GetNotes(req, res);
});

router.post("/add_note", (req, res) => {
  Notes.AddNote(req, res);
});

router.post("/remove_note", (req, res) => {
  Notes.RemoveNote(req, res);
});

// ------- Posts -------

router.post("/get_posts", (req, res) => {
  Posts.GetPosts(req, res);
});

router.post("/add_post", (req, res) => {
  Posts.AddPost(req, res);
});

router.post("/remove_post", (req, res) => {
  Posts.RemovePost(req, res);
});

// ------- Comments -------

router.post("/get_comments", (req, res) => {
  Comments.GetComments(req, res);
});

router.post("/add_comment", (req, res) => {
  Comments.AddComment(req, res);
});

router.post("/remove_comment", (req, res) => {
  Comments.RemoveComment(req, res);
});

// ------- Relations -------

router.post("/get_relations", (req, res) => {
  Relations.GetRelations(req, res);
});

router.post("/get_related_by_targets", (req, res) => {
  Relations.GetRelatedByTargets(req, res);
});

router.post("/add_relation", (req, res) => {
  Relations.AddRelation(req, res);
});

// ------- Tasks -------

router.post("/get_tasks", (req, res) => {
  Tasks.GetTasks(req, res);
});

router.post("/add_task", (req, res) => {
  Tasks.AddTask(req, res);
});

router.post("/remove_task", (req, res) => {
  Tasks.RemoveTask(req, res);
});

router.post("/remove_task", (req, res) => {
  Tasks.RemoveTask(req, res);
});

router.post("/get_tasks_by_agent", (req, res) => {
  Tasks.GetTasksByagent(req, res);
});

// ------- Members -------

router.post("/get_members", (req, res) => {
  Members.GetMembers(req, res);
});

router.post("/add_member", (req, res) => {
  Members.AddMember(req, res);
});

module.exports = router;
