const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");
const Notes = require("./Notes");

module.exports = {
  get_targets: async (req, res) => {
    try {
      const { o_id } = req.body;

      const sqlQuery = "SELECT * FROM targets INNER JOIN users ON targets.t_user=users.u_id WHERE targets.t_operation=? ORDER BY targets.t_id DESC";

      await pool.query(sqlQuery, [o_id], (err, results) => {
        if (err) console.log(err);
        if (results) {
          res.status(200).json({ data: results });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  add_target: async (req, res) => {
    try {
      let {
        t_operation,
        t_name,
        t_type,
        t_image,
        t_description,
        t_location,
      } = req.body;

      let t_id = CommonFunctions.Generate_Id();
      const date = new Date();
      const user = "c694568f-d";

      t_image = t_image == true ? t_image : "";

      const sqlQuery = "INSERT INTO targets VALUES (?,?,?,?,?,?,?,?,?,?)";
      await pool.query(
        sqlQuery,
        [
          t_id,
          user,
          t_operation,
          t_name,
          t_type,
          t_image,
          t_description,
          t_location,
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

  remove_target: async (req, res) => {
    try {
      const { t_id } = req.body;

      const sqlQuery = "DELETE FROM targets WHERE t_id=?";
      await pool.query(sqlQuery, [t_id], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          let target_notes = Notes.remove_notes_by_target_internal(t_id);
          if (target_notes) {
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

  remove_targets_by_operation_internal: async (o_id) => {
    try {
      const sqlQuery = "DELETE FROM targets WHERE t_operation=?";
      await pool.query(sqlQuery, [o_id], (err, results) => {
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
