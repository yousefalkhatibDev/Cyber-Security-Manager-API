const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");
const Comments = require("./Comments");
const jwt = require("jsonwebtoken");

module.exports = {
  GetPosts: async (req, res) => {
    try {
      const { OperationID } = req.body;

      const sqlQuery =
        "SELECT *, users.u_name FROM posts INNER JOIN users ON posts.p_user=users.u_id WHERE posts.p_operation=? ORDER BY posts.p_create_date DESC";
      pool.query(sqlQuery, [OperationID], (err, results) => {
        if (err) console.log(err);
        if (results) {
          // results[0]["p_user_name"] = owner[0].u_name
          res.status(200).json({ data: results });
        } else {
          res.status(500).json({ error: false });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  AddPost: async (req, res) => {
    try {
      let {Token, PostTitle, PostText, PostImage, PostOperation } = req.body;

      let PostID = CommonFunctions.Generate_Id();
      let PostUser = jwt.verify(Token, process.env.SECRET).id
      const date = new Date();

      PostImage = PostImage == true ? PostImage : "";

      const sqlQuery = "INSERT INTO posts VALUES (?,?,?,?,?,?,?,?)";
      await pool.query(
        sqlQuery,
        [PostID, PostUser, PostTitle, PostText, PostImage, PostOperation, date, date],
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

  RemovePost: async (req, res) => {
    try {
      const { p_id } = req.body;

      const sqlQuery = "DELETE FROM posts WHERE p_id=?";
      await pool.query(sqlQuery, [p_id], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          let post_comments = Comments.Remove_Comments_By_Post_Internal(p_id);
          if (post_comments) {
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

  Remove_Posts_By_Operation_Internal: async (p_opeartion) => {
    try {
      const sqlQuery = "DELETE FROM posts WHERE p_operation=?";
      await pool.query(sqlQuery, [p_opeartion], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          return true;
        } else {
          return false;
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
