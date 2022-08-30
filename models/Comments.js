const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");

module.exports = {
  GetComments: async (req, res) => {
    try {
      const { PostID } = req.body;
      const sqlQuery =
      "SELECT *, users.u_name FROM comments INNER JOIN users ON comments.c_user=users.u_id WHERE comments.c_post=? ORDER BY comments.c_create_date DESC";
      await pool.query(sqlQuery, [PostID], (err, results) => {
        if (err) console.log(err);
        if (results) {
          res.status(200).json({ data: results });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  AddComment: async (req, res) => {
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
          if (results.affectedRows) {
            res.status(200).json({ data: true });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  RemoveComment: async (req, res) => {
    try {
      const { c_id } = req.body;

      const sqlQuery = "DELETE FROM comments WHERE c_id=?";
      await pool.query(sqlQuery, [c_id], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          res.status(200).json({ data: true });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Remove_Comments_By_Post_Internal: async (post_id) => {
    try {
      const sqlQuery = "DELETE FROM comments WHERE c_post=?";
      await pool.query(sqlQuery, [post_id], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          return true;
        } else {
          return false;
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
