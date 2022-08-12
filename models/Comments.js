const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");

module.exports = {
  get_comments: async (req, res) => {
    try {
      const { p_id } = req.body;

      const sqlQuery = "SELECT * FROM comments WHERE c_post=? ORDER BY c_id DESC";
      await pool.query(sqlQuery, [p_id], (err, results) => {
        if (err) console.log(err);
        if (results) {
          res.status(200).json({ data: results });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  add_comment: async (req, res) => {
    try {
      const { c_post, c_text } = req.body;

      let c_id = CommonFunctions.Generate_Id();
      const date = new Date();
      const user = "c694568f-d";

      const sqlQuery = "INSERT INTO comments VALUES (?,?,?,?,?,?)";
      await pool.query(
        sqlQuery,
        [c_id, user, c_post, c_text, date, date],
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

  remove_comment: async (req, res) => {
    try {
      const { c_id } = req.body;

      const sqlQuery = "DELETE FROM comments WHERE c_id=?";
      await pool.query(sqlQuery, [c_id], (err, results) => {
        if (err) console.log(err);
        if (results) {
          res.status(200).json({ data: true });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  remove_comments_by_post_internal: async (post_id) => {
    try {
      const sqlQuery = "DELETE FROM comments WHERE c_post=?";
      await pool.query(sqlQuery, [post_id], (err, results) => {
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
