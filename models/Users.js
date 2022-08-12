const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");
const Operations = require("./Operations");

module.exports = {
  login: async (req, res) => {
    try {
      const { u_email, u_password } = req.body;

      const sqlQuery = "SELECT * FROM users WHERE u_email=? AND u_password=?";
      await pool.query(
        sqlQuery,
        [u_email, u_password],
        (err, results) => {
          if (err) console.log(err);
          if (results) {
            res.status(200).json({ data: results });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  add_user: async (req, res) => {
    try {
      let { u_email, u_name, u_image, u_bio, u_password } = req.body;

      let u_id = CommonFunctions.Generate_Id();
      const date = new Date();

      u_image = u_image == true ? u_image : "";

      const sqlQuery = "INSERT INTO users VALUES (?,?,?,?,?,?,?,?)";
      await pool.query(
        sqlQuery,
        [u_id, u_email, u_name, u_image, u_bio, u_password, date, date],
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

  remove_user: async (req, res) => {
    try {
      const { u_id } = req.body;

      const sqlQuery = "DELETE FROM users WHERE u_id=?";
      await pool.query(sqlQuery, [u_id], (err, results) => {
        if (err) console.log(err);
        if (results) {
          let user_operations = Operations.remove_operation_by_user_internal(u_id);
          if (user_operations) {
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
};
