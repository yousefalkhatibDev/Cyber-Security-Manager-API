const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");

module.exports = {
  add_user: async (req, res) => {
    try {
      const { u_name, u_image, u_bio, u_password } = req.body;

      let u_id = CommonFunctions.Generate_Id();
      const date = new Date();

      const sqlQuery = "INSERT INTO users VALUES (?,?,?,?,?,?,?)";
      await pool.query(sqlQuery, [u_id, u_name, u_image, u_bio, u_password, date, date], (err, results) => {
        if (err) console.log(err);
        if (results) {
          res.status(200).json({ data: true });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  remove_user: async (req, res) => {
    try {
      const { u_id } = req.body;

      const sqlQuery = "DELETE FROM users WHERE u_id=?";
      await pool.query(sqlQuery, [u_id], (err, results) => {
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
