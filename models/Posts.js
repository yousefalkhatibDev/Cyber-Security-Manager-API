const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");

module.exports = {
  get_posts: async (req, res) => {
    try {
      const { o_id } = req.body;

      const sqlQuery = "SELECT * FROM posts WHERE p_operation=?";
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

  add_post: async (req, res) => {
    try {
      const { p_title, p_text, p_image, p_operation } = req.body;

      let p_id = CommonFunctions.Generate_Id();
      const date = new Date();
      const user = "ahmad";

      const sqlQuery = "INSERT INTO posts VALUES (?,?,?,?,?,?,?,?)";
      await pool.query(sqlQuery, [p_id, user, p_title, p_text, p_image, p_operation, date, date], (err, results) => {
        if (err) console.log(err);
        if (results) {
          res.status(200).json({ data: true });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  remove_post: async (req, res) => {
    try {
      const { p_id } = req.body;

      const sqlQuery = "DELETE FROM posts WHERE p_id=?";
      await pool.query(sqlQuery, [p_id], (err, results) => {
        if (err) console.log(err);
        if (results) {
          res.status(200).json({ data: true });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
