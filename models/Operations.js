const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");

module.exports = {
  get_operations: async (req, res) => {
    try {
      const { u_id } = req.body;

      const sqlQuery = "SELECT * FROM operations WHERE o_user=?";
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
      const {
        o_user,
        o_password,
        o_description,
        o_image,
        o_state,
      } = req.body;

      let o_id = CommonFunctions.Generate_Id();
      const date = new Date();
      const user = "ahmad";

      const sqlQuery = "INSERT INTO operations VALUES (?,?,?,?,?,?,?,?)";
      await pool.query(
        sqlQuery,
        [
          o_id,
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

  remove_operation: async (req, res) => {
    try {
      const { o_id } = req.body;

      const sqlQuery = "DELETE FROM operations WHERE o_id=?";
      await pool.query(sqlQuery, [o_id], (err, results) => {
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
