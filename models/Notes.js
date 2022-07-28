const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");

module.exports = {
  get_notes: async (req, res) => {
    try {
      const { t_id } = req.body;

      const sqlQuery = "SELECT * FROM notes WHERE n_target=?";
      await pool.query(sqlQuery, [t_id], (err, results) => {
        if (err) console.log(err);
        if (results) {
          res.status(200).json({ data: results });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  add_note: async (req, res) => {
    try {
      const { n_target, n_operation, n_type, n_title, n_text } = req.body;

      let n_id = CommonFunctions.Generate_Id();
      const date = new Date();
      const user = "ahmad";

      const sqlQuery = "INSERT INTO notes VALUES (?,?,?,?,?,?,?,?,?)";
      await pool.query(
        sqlQuery,
        [
          n_id,
          user,
          n_target,
          n_operation,
          n_type,
          n_title,
          n_text,
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

  remove_note: async (req, res) => {
    try {
      const { n_id } = req.body;

      const sqlQuery = "DELETE FROM targets WHERE n_id=?";
      await pool.query(sqlQuery, [n_id], (err, results) => {
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
