const pool = require("../helper/database").pool;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const CommonFunctions = require("../helper/CommonFunctions");
const AuthConfig = require("../config/auth.config");

module.exports = {
  Login: async (req, res) => {
    try {
      const { Email, Password } = req.body;
      const sqlQuery = "SELECT * FROM users WHERE u_email=?";

      await pool.query(sqlQuery, [Email], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: "Error While Logging The User" });
        if (results.length > 0) {
          const Compare = bcrypt.compareSync(Password, results[0].u_password);
          if (Compare) {
            const token = jwt.sign({ id: results[0].u_id }, AuthConfig.secret, {
              expiresIn: 86400, // 24 hours
            });
            req.session.token = token;
            res.status(200).json({ data: token });
          }
          else {
            res.status(200).json({ data: false });
          }
        } else {
          res.status(200).json({ data: false });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Logout: async (req, res) => {
    try {
      req.session = null;
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Register: async (req, res) => {
    try {
      const {
        UserEmail,
        UserName,
        UserImage,
        UserBio,
        UserPassword,
      } = req.body;
      const UserID = CommonFunctions.Generate_Id();
      const date = new Date();
      const sqlQuery = "INSERT INTO users VALUES (?,?,?,?,?,?,?,?)";

      await pool.query(
        sqlQuery,
        [
          UserID,
          UserEmail,
          UserName,
          UserImage,
          UserBio,
          bcrypt.hashSync(UserPassword, 8),
          date,
          date,
        ],
        (err, results) => {
          if (err) res.status(200).json({ ErrorMessage: "Error While Register The User" });
          if (results.affectedRows) res.status(200).json({ data: true });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
