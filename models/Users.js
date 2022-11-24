const pool = require("../helper/database").pool;
const Operations = require("./Operations");
const jwt = require("jsonwebtoken");

module.exports = {
  RemoveUser: async (req, res) => {
    try {
      const { u_id } = req.body;
      const sqlQuery = "DELETE FROM users WHERE u_id=?";

      await pool.query(sqlQuery, [u_id], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: "Error While Removing User" });
        if (results.affectedRows) res.status(200).json({ data: true });
        else res.status(200).json({ ErrorMessage: "Error While Removing User" });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  UpdateUserInfo: async (req, res) => {
    try {
      const { Token, UserEmail, UserName, UserBio } = req.body;
      const UserID = jwt.verify(Token, process.env.SECRET).id;
      const date = new Date();
      const sqlQuery = "UPDATE users SET u_email=?, u_name=?, u_bio=?, u_update_date=? WHERE u_id=?";
      
      await pool.query(sqlQuery, [UserEmail, UserName, UserBio, date, UserID], (err, results) => {
          if (err) res.status(200).json({ ErrorMessage: "Error While Updating User Email" });
          if (results.affectedRows) res.status(200).json({ data: true });
          else res.status(200).json({ ErrorMessage: "Error While Updating User Email" });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  GetUserInfo: async (req, res) => {
    try {
      const { Token } = req.body;
      const UserID = jwt.verify(Token, process.env.SECRET).id;
      const sqlQuery = "SELECT * FROM users WHERE u_id=?";

      await pool.query(sqlQuery, [UserID], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: "Error While Getting User Information" });
        if (results.length > 0) res.status(200).json({ data: results[0] });
        else res.status(200).json({ ErrorMessage: "Error While Getting User Information" });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  UpdateUserImage: async (req, res) => {
    try {
      const { Token, UserImage } = req.body;
      const UserID = jwt.verify(Token, process.env.SECRET).id;
      const date = new Date();
      const sqlQuery = "UPDATE users SET u_image=?, u_update_date=? WHERE u_id=?";

      await pool.query(sqlQuery, [UserImage, date, UserID], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: "Error While Updating User Image" });
        if (results.affectedRows) res.status(200).json({ data: true });
        else res.status(200).json({ ErrorMessage: "Error While Updating User Image" });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
