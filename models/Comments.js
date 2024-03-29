const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");
const jwt = require("jsonwebtoken");

module.exports = {
  GetComments: async (req, res) => {
    try {
      const { PostID, Token } = req.body;
      const UserID = jwt.verify(Token, process.env.SECRET).id;
      const sqlQuery = `SELECT *, users.u_name FROM comments INNER JOIN users ON comments.c_user=users.u_id WHERE comments.c_post=?
                        ORDER BY comments.c_create_date DESC`;

      await pool.query(sqlQuery, [PostID], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: "Error While Getting Comments" });
        if (results) {
          results.map((comment, i) => {
            if (comment.c_user === UserID) comment.BelongToUser = true;
            else comment.BelongToUser = false;
          });
          res.status(200).json({ data: results });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  AddComment: async (req, res) => {
    try {
      const { CommnetPost, CommnetText, Token } = req.body;
      let CommnetID = CommonFunctions.Generate_Id();
      let CommnetUser = jwt.verify(Token, process.env.SECRET).id;
      const date = new Date();
      const sqlQuery = "INSERT INTO comments VALUES (?,?,?,?,?,?)";

      await pool.query(sqlQuery, [CommnetID, CommnetUser, CommnetPost, CommnetText, date, date], (err, results) => {
          if (err) res.status(200).json({ ErrorMessage: "Error While Adding New Comment" });
          if (results.affectedRows) res.status(200).json({ data: true });
          else res.status(200).json({ ErrorMessage: "Error While Adding New Comment" });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  RemoveComment: async (req, res) => {
    try {
      const { CommnetID } = req.body;
      const sqlQuery = "DELETE FROM comments WHERE c_id=?";
    
      await pool.query(sqlQuery, [CommnetID], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: "Error While Removing Comment" });
        if (results.affectedRows) res.status(200).json({ data: true });
        else res.status(200).json({ ErrorMessage: "Error While Removing Comment" });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Remove_Comments_By_Post_Internal: async (PostID) => {
    try {
      const sqlQuery = "DELETE FROM comments WHERE c_post=?";

      await pool.query(sqlQuery, [PostID], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: "Error While Removing Comment" });
        if (results.affectedRows) return true;
        else return false;
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
