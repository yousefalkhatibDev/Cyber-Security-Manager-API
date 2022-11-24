const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");
const Comments = require("./Comments");
const jwt = require("jsonwebtoken");

module.exports = {
  GetPosts: async (req, res) => {
    try {
      const { Token, OperationID, search } = req.body;
      const UserID = jwt.verify(Token, process.env.SECRET).id;

      if (search) {
        const searchTerm = "%".concat(search.concat("%"));
        const sqlQuery = `SELECT *, users.u_name FROM posts INNER JOIN users ON posts.p_user=users.u_id WHERE posts.p_operation=?
                          AND (posts.p_title LIKE ? OR posts.p_text LIKE ?) ORDER BY posts.p_create_date DESC`;

        await pool.query(sqlQuery, [OperationID, searchTerm, searchTerm], (err, results) => {
            if (err) res.status(200).json({ ErrorMessage: "Error While Getting Posts" });
            if (results) {
              results.map((post, i) => {
                if (post.p_user === UserID) post.BelongToUser = true;
                else post.BelongToUser = false;
              });
              res.status(200).json({ data: results });
            }
            else res.status(200).json({ ErrorMessage: "Error While Getting Posts" });
          }
        );
      } else {
        const sqlQuery = `SELECT *, users.u_name FROM posts INNER JOIN users ON posts.p_user=users.u_id
                          WHERE posts.p_operation=? ORDER BY posts.p_create_date DESC`;

        await pool.query(sqlQuery, [OperationID], (err, results) => {
          if (err) res.status(200).json({ ErrorMessage: "Error While Getting Posts" });
          if (results) {
            results.map((post, i) => {
              if (post.p_user === UserID) post.BelongToUser = true;
              else post.BelongToUser = false;
            });
            res.status(200).json({ data: results });
          }
          else res.status(200).json({ ErrorMessage: "Error While Getting Posts" });
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  AddPost: async (req, res) => {
    try {
      let { Token, PostTitle, PostText, PostImage, PostOperation } = req.body;
      const PostID = CommonFunctions.Generate_Id();
      const PostUser = jwt.verify(Token, process.env.SECRET).id;
      const date = new Date();
      PostImage = PostImage == true ? PostImage : "";
      const sqlQuery = "INSERT INTO posts VALUES (?,?,?,?,?,?,?,?)";
      
      await pool.query(sqlQuery,[PostID, PostUser, PostTitle, PostText, PostImage, PostOperation, date, date], (err, results) => {
          if (err) res.status(200).json({ ErrorMessage: "Error While Adding Post" });
          if (results.affectedRows) res.status(200).json({ data: true });
          else res.status(200).json({ ErrorMessage: "Error While Adding Post" }); 
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  RemovePost: async (req, res) => {
    try {
      const { PostID } = req.body;
      const sqlQuery = "DELETE FROM posts WHERE p_id=?";
      
      await pool.query(sqlQuery, [PostID], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: "Error While Removing Post" });
        if (results.affectedRows) {
          const post_comments = Comments.Remove_Comments_By_Post_Internal(PostID);
          if (post_comments) res.status(200).json({ data: true });
          else res.status(200).json({ ErrorMessage: "Error While Removing Post" });
        } 
        else res.status(200).json({ ErrorMessage: "Error While Removing Post" });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Remove_Posts_By_Operation_Internal: async (p_opeartion) => {
    try {
      const sqlQuery = "DELETE FROM posts WHERE p_operation=?";

      await pool.query(sqlQuery, [p_opeartion], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: "Error While Removing Post ( Internal )" });
        if (results.affectedRows) return true;
        else return false;
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  GetRecentPosts: async (req, res) => {
    try {
      const { Token } = req.body;
      const UserID = jwt.verify(Token, process.env.SECRET).id;
      const sqlQuery = `SELECT * FROM (SELECT * FROM (SELECT o_id FROM operations LEFT JOIN members ON members.m_operation=operations.o_id
                        WHERE members.m_agent="c694568f-d") AS UserOperations 
                        JOIN posts ON p_operation=UserOperations.o_id ORDER BY p_update_date DESC) AS PostsUsers
                        JOIN users ON u_id=PostsUsers.p_user ORDER BY p_update_date DESC`;

      await pool.query(sqlQuery, [UserID], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: "Error While Getting Recent Posts" });
        if (results.length > 0) res.status(200).json({ data: results });
        else res.status(200).json({ ErrorMessage: "Error While Getting Recent Posts" });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
