const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");
const Posts = require("./Posts");
const Targets = require("./Targets");

module.exports = {
  GetOperations: async (req, res) => {
    try {
      const { u_id } = req.body;

      const sqlQuery =
        "SELECT * FROM operations WHERE o_user=? ORDER BY o_id DESC";
      await pool.query(sqlQuery, [u_id], (err, results) => {
        if (err) console.log(err);
        if (results) {
          res.status(200).json({ data: results });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  AddOperation: async (req, res) => {
    try {
      let { o_name, o_password, o_description, o_image, o_state } = req.body;

      let o_id = CommonFunctions.Generate_Id();
      const date = new Date();
      const user = "c694568f-d";

      o_image = o_image == true ? o_image : "";

      const sqlQuery = "INSERT INTO operations VALUES (?,?,?,?,?,?,?,?,?)";
      await pool.query(
        sqlQuery,
        [
          o_id,
          o_name,
          user,
          o_password,
          o_description,
          o_image,
          o_state,
          date,
          date,
        ],
        (err, results) => {
          if (err) console.log(err);
          if (results.affectedRows) {
            res.status(200).json({ data: true });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // remove posts, targets
  RemoveOperation: async (req, res) => {
    try {
      const { o_id } = req.body;

      const sqlQuery = "DELETE FROM operations WHERE o_id=?";
      await pool.query(sqlQuery, [o_id], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          let operation_posts = Posts.Remove_Posts_By_Operation_Internal(o_id);
          let operation_targets =
            Targets.Remove_Targets_By_Operation_Internal(o_id);
          if (operation_posts && operation_targets) {
            res.status(200).json({ data: true });
          } else {
            res.status(500).json({ data: false });
          }
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  UpdateDescription: async (req, res) => {
    try {
      const { id, description } = req.body;

      const sqlQuery = "UPDATE operations SET o_description=? WHERE o_id=?";
      await pool.query(sqlQuery, [description, id], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          res.status(200).json({ data: true });
        } else {
          res.status(500).json({ data: false });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  UpdateName: async (req, res) => {
    try {
      const { id, name } = req.body;

      const sqlQuery = "UPDATE operations SET o_name=? WHERE o_id=?";
      await pool.query(sqlQuery, [name, id], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          res.status(200).json({ data: true });
        } else {
          res.status(500).json({ data: false });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  UpdateState: async (req, res) => {
    try {
      const { id, state } = req.body;

      const sqlQuery = "UPDATE operations SET o_state=? WHERE o_id=?";
      await pool.query(sqlQuery, [state, id], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          res.status(200).json({ data: true });
        } else {
          res.status(500).json({ data: false });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Remove_Operation_By_User_Internal: async (o_user) => {
    try {
      const sqlQuery = "DELETE FROM operations WHERE o_user=?";
      await pool.query(sqlQuery, [o_user], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          return true;
        } else {
          return false;
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  },
};
