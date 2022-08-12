const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");
const Posts = require("./Posts");
const Targets = require("./Targets");

module.exports = {
  get_operations: async (req, res) => {
    try {
      const { u_id } = req.body;

      const sqlQuery = "SELECT * FROM operations WHERE o_user=? ORDER BY o_id DESC";
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

  add_operation: async (req, res) => {
    try {
      let {
        o_name,
        o_password,
        o_description,
        o_image,
        o_state,
      } = req.body;

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
          if (results) {
            res.status(200).json({ data: true });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // remove posts, targets
  remove_operation: async (req, res) => {
    try {
      const { o_id } = req.body;

      const sqlQuery = "DELETE FROM operations WHERE o_id=?";
      await pool.query(sqlQuery, [o_id], (err, results) => {
        if (err) console.log(err);
        if (results) {
          let operation_posts = Posts.remove_posts_by_operation_internal(o_id);
          let operation_targets = Targets.remove_targets_by_operation_internal(o_id);
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

  remove_operation_by_user_internal: async (o_user) => {
    try {
      const sqlQuery = "DELETE FROM operations WHERE o_user=?";
      await pool.query(sqlQuery, [o_user], (err, results) => {
        if (err) console.log(err);
        if (results) {
          return true;
        } else {
          return false;
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
