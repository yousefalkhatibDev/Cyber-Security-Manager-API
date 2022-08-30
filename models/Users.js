const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");
const Operations = require("./Operations");

module.exports = {
  AddUser: async (req, res) => {
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
          if (results.affectedRows) {
            res.status(200).json({ data: true });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  RemoveUser: async (req, res) => {
    try {
      const { u_id } = req.body;

      const sqlQuery = "DELETE FROM users WHERE u_id=?";
      await pool.query(sqlQuery, [u_id], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          let user_operations =
            Operations.Remove_Operation_By_User_Internal(u_id);
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

  UpdateEmail: async (req, res) => {
    try {
      const { id, email } = req.body;

      const sqlQuery = "UPDATE users SET u_email=? WHERE u_id=?";
      await pool.query(sqlQuery, [email, id], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          res.status(200).json({ data: true });
        } else {
          res.status(500).json({ data: false });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  UpdateName: async (req, res) => {
    try {
      const { id, name } = req.body;

      const sqlQuery = "UPDATE users SET u_name=? WHERE u_id=?";
      await pool.query(sqlQuery, [name, id], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          res.status(200).json({ data: true });
        } else {
          res.status(500).json({ data: false });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  UpdateBio: async (req, res) => {
    try {
      const { id, bio } = req.body;

      const sqlQuery = "UPDATE users SET u_bio=? WHERE u_id=?";
      await pool.query(sqlQuery, [bio, id], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          res.status(200).json({ data: true });
        } else {
          res.status(500).json({ data: false });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
