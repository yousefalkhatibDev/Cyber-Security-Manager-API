const pool = require("../helper/database").pool;

module.exports = {
  Login: async (req, res) => {
    try {
      const { Email, Password } = req.body;

      const sqlQuery = "SELECT * FROM users WHERE u_email=? AND u_password=?";
      await pool.query(sqlQuery, [Email, Password], (err, results) => {
        if (err) console.log(err);
        if (results) {
          req.body.session = results[0].u_id;
          res.status(200).json({ data: results[0].u_id });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Logout: async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Register: async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
