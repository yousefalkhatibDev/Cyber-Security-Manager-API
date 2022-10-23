const pool = require("../helper/database").pool;
const Operations = require("./Operations");

module.exports = {
  RemoveUser: async (req, res) => {
    try {
      const { u_id } = req.body;

      const sqlQuery = "DELETE FROM users WHERE u_id=?";
      await pool.query(sqlQuery, [u_id], (err, results) => {
        if (err) {
          console.log(err);
          res.status(200).json({ ErrorMessage: "Error While Removing User" });
        }
        if (results.affectedRows) {
          let user_operations = Operations.Remove_Operation_By_User_Internal(u_id);
          if (user_operations) {
            res.status(200).json({ data: true });
          } else {
            res.status(200).json({ ErrorMessage: "Error While Removing User" });
          }
        } else {
          res.status(200).json({ ErrorMessage: "Error While Removing User" });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  UpdateUserInfo: async (req, res) => {
    try {
      const { Token, UserEmail, UserName, UserBio } = req.body;
      let UserID = jwt.verify(Token, process.env.SECRET).id;

      const sqlQuery = "UPDATE users SET u_email=?, u_name=?, u_bio=? WHERE u_id=?";
      await pool.query(sqlQuery, [UserEmail, UserName, UserBio, UserID], (err, results) => {
        if (err) {
          console.log(err);
          res
            .status(200)
            .json({ ErrorMessage: "Error While Updating User Email" });
        }
        if (results.affectedRows) {
          res.status(200).json({ data: true });
        } else {
          res
            .status(200)
            .json({ ErrorMessage: "Error While Updating User Email" });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
