const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");
const Posts = require("./Posts");
const Targets = require("./Targets");
const Members = require("./Members");
const Tasks = require("./Tasks");
const jwt = require("jsonwebtoken");

module.exports = {
  GetOperationInfo: async (req, res) => {
    try {
      const { OperationID } = req.body;
      const sqlQuery = "SELECT * FROM operations WHERE o_id=?";

      await pool.query(sqlQuery, [OperationID], (err, results) => {
        if (err) {
          console.log(err);
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Operation Info" });
        }
        if (results.length > 0) {
          res.status(200).json({ data: results });
        } else {
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Operation Info" });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  GetOperations: async (req, res) => {
    try {
      const { Token, search } = req.body;
      const UserID = jwt.verify(Token, process.env.SECRET).id;

      if (search) {
        var searchTerm = "%".concat(search.concat("%"));
        const sqlQuery = `SELECT * FROM operations 
              LEFT JOIN members ON members.m_operation=operations.o_id 
              WHERE members.m_agent=? AND (operations.o_name 
              LIKE ? OR operations.o_description LIKE ?)
              ORDER BY operations.o_create_date DESC `;

        await pool.query(
          sqlQuery,
          [UserID, searchTerm, searchTerm],
          (err, results) => {
            if (err) {
              console.log(err);
              res
                .status(200)
                .json({ ErrorMessage: "Error While Getting Operations" });
            }
            if (results) {
              res.status(200).json({ data: results });
            }
          }
        );
      } else {
        const sqlQuery = `SELECT * FROM operations 
              LEFT JOIN members ON members.m_operation=operations.o_id 
              WHERE members.m_agent=? ORDER BY operations.o_create_date DESC`;

        await pool.query(sqlQuery, [UserID], (err, results) => {
          if (err) {
            console.log(err);
            res
              .status(200)
              .json({ ErrorMessage: "Error While Getting Operations" });
          }
          if (results) {
            res.status(200).json({ data: results });
          }
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  AddOperation: async (req, res) => {
    try {
      const {
        Token,
        OperationName,
        OperationPassword,
        OperationDescription,
        OperationImage,
        OperationState,
      } = req.body;
      const OperationID = CommonFunctions.Generate_Id();
      const OperationUser = jwt.verify(Token, process.env.SECRET).id;
      const date = new Date();
      const sqlQuery = `INSERT INTO operations VALUES (?,?,?,?,?,?,?,?,?,?)`;

      await pool.query(
        sqlQuery,
        [
          OperationID,
          OperationName,
          OperationUser,
          OperationPassword,
          OperationDescription,
          OperationImage,
          OperationState,
          date,
          date,
          null
        ],
        (err, results) => {
          if (err) {
            console.log(err);
            res
              .status(200)
              .json({ ErrorMessage: "Error While Adding Operation" });
          }
          if (results.affectedRows) {
            const AddTheUserAsMember = Members.Add_Member_Internal(
              OperationUser,
              OperationID
            );
            if (AddTheUserAsMember) {
              res.status(200).json({ data: true });
            } else {
              res
                .status(200)
                .json({ ErrorMessage: "Error While Adding Operation" });
            }
          } else {
            res
              .status(200)
              .json({ ErrorMessage: "Error While Adding Operation" });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  GetOperationImage: async (req, res) => {
    try {
      const { OperationID } = req.body;
      const sqlQuery = `SELECT o_image FROM operations WHERE o_id=?`;

      await pool.query(sqlQuery, [OperationID], (err, results) => {
        if (err) {
          console.log(err);
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Operation Image" });
        }
        if (results.length > 0) {
          res.status(200).json({ data: results[0] });
        } else {
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Operation Image" });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  RemoveOperation: async (req, res) => {
    try {
      const { OperationID } = req.body;
      const sqlQuery = `DELETE FROM operations WHERE o_id=?`;

      await pool.query(sqlQuery, [OperationID], (err, results) => {
        if (err) {
          console.log(err);
          res
            .status(200)
            .json({ ErrorMessage: "Error While Removing Operation" });
        }
        if (results.affectedRows) {
          let operation_posts =
            Posts.Remove_Posts_By_Operation_Internal(OperationID);
          let operation_targets =
            Targets.Remove_Targets_By_Operation_Internal(OperationID);
          let operation_tasks =
            Tasks.Remove_Tasks_By_Operation_Internal(OperationID);

          if (operation_posts && operation_targets && operation_tasks) {
            res.status(200).json({ data: true });
          } else {
            res
              .status(200)
              .json({ ErrorMessage: "Error While Removing Operation" });
          }
        } else {
          res
            .status(200)
            .json({ ErrorMessage: "Error While Removing Operation" });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  UpdateOperationInfo: async (req, res) => {
    try {
      const { OperationID, OperationName, OperationDescription } = req.body;
      const sqlQuery = `UPDATE operations SET o_name=?, o_description=? WHERE o_id=?`;

      await pool.query(
        sqlQuery,
        [OperationName, OperationDescription, OperationID],
        (err, results) => {
          if (err) {
            console.log(err);
            res
              .status(200)
              .json({ ErrorMessage: "Error While Updating Operation Info" });
          }
          if (results.affectedRows) {
            res.status(200).json({ data: true });
          } else {
            res
              .status(200)
              .json({ ErrorMessage: "Error While Updating Operation Info" });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  UpdateOperationState: async (req, res) => {
    try {
      const { OperationID, OperationState } = req.body;
      const sqlQuery = `UPDATE operations SET o_state=? WHERE o_id=?`;

      await pool.query(
        sqlQuery,
        [OperationState, OperationID],
        (err, results) => {
          if (err) {
            console.log(err);
            res
              .status(200)
              .json({ ErrorMessage: "Error While Updating Operation State" });
          }
          if (results.affectedRows) {
            res.status(200).json({ data: true });
          } else {
            res
              .status(200)
              .json({ ErrorMessage: "Error While Updating Operation State" });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Remove_Operation_By_User_Internal: async (o_user) => {
    try {
      const sqlQuery = `DELETE FROM operations WHERE o_user=?`;

      await pool.query(sqlQuery, [o_user], (err, results) => {
        if (err) {
          console.log(err);
          res.status(200).json({
            ErrorMessage: "Error While Removing Operation ( Internal )",
          });
        }
        if (results.affectedRows) {
          return true;
        } else {
          return false;
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  },

  GetOperationMembersCount: async (req, res) => {
    try {
      const { OperationID } = req.body;
      const sqlQuery = `SELECT count(*) AS MembersCount FROM members WHERE m_operation=?`;

      await pool.query(sqlQuery, [OperationID], (err, results) => {
        if (err) {
          console.log(err);
          res.status(200).json({
            ErrorMessage: "Error While Getting Operation Members Count",
          });
        }
        if (results.length > 0) {
          res.status(200).json({ data: results });
        } else {
          res.status(200).json({
            ErrorMessage: "Error While Getting Operation Members Count",
          });
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  },

  GetOperationPostsCount: async (req, res) => {
    try {
      const { OperationID } = req.body;
      const sqlQuery = `SELECT count(*) AS PostsCount FROM posts WHERE p_operation=?`;

      await pool.query(sqlQuery, [OperationID], (err, results) => {
        if (err) {
          console.log(err);
          res.status(200).json({
            ErrorMessage: "Error While Getting Operation Posts Count",
          });
        }
        if (results.length > 0) {
          res.status(200).json({ data: results });
        } else {
          res.status(200).json({
            ErrorMessage: "Error While Getting Operation Posts Count",
          });
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  },

  GetOperationTargetsCount: async (req, res) => {
    try {
      const { OperationID } = req.body;
      const sqlQuery = `SELECT count(*) AS TargetsCount FROM targets WHERE t_operation=?`;

      await pool.query(sqlQuery, [OperationID], (err, results) => {
        if (err) {
          console.log(err);
          res.status(200).json({
            ErrorMessage: "Error While Getting Operation Targets Count",
          });
        }
        if (results.length > 0) {
          res.status(200).json({ data: results });
        } else {
          res.status(200).json({
            ErrorMessage: "Error While Getting Operation Targets Count",
          });
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  },

  GetLastAccessedOperation: async (req, res) => {
    try {
      const { Token } = req.body;
      const UserID = jwt.verify(Token, process.env.SECRET).id;
      const sqlQuery = `SELECT * FROM operations WHERE o_user=? ORDER BY o_last_access DESC LIMIT 1`;

      await pool.query(sqlQuery, [UserID], (err, results) => {
        if (err) {
          console.log(err);
          res.status(200).json({
            ErrorMessage: "Error While Getting Last Accessed Operation",
          });
        }
        if (results) res.status(200).json({ data: results });
        // else if (results.length > 0) res.status(200).json({data: [] });
        else res.status(200).json({ ErrorMessage: "Error While Getting Last Accessed Operation", });
      });
    } catch (error) {
      console.error(error.message);
    }
  },

  SetLastAccessedOperation: async (req, res) => {
    try {
      const { OperationID } = req.body;
      const sqlQuery = `UPDATE operations SET o_last_access=? WHERE o_id=?`;
      const date = new Date();

      await pool.query(sqlQuery, [date, OperationID], (err, results) => {
        if (err) {
          console.log(err);
          res.status(200).json({
            ErrorMessage: "Error While Setting Last Accessed Operation",
          });
        }
        if (results.affectedRows) {
          res.status(200).json({ data: true });
        } else {
          res.status(200).json({
            ErrorMessage: "Error While Setting Last Accessed Operation",
          });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  GetOperationsCount: async (req, res) => {
    try {
      const { Token } = req.body;
      const UserID = jwt.verify(Token, process.env.SECRET).id;
      const sqlQuery = `SELECT count(*) AS OperationsCount FROM operations WHERE o_user=?`;

      await pool.query(sqlQuery, [UserID], (err, results) => {
        if (err) {
          console.log(err);
          res.status(200).json({
            ErrorMessage: "Error While Getting Operations Count",
          });
        }
        if (results.length > 0) {
          res.status(200).json({ data: results });
        } else {
          res.status(200).json({
            ErrorMessage: "Error While Getting Operations Count",
          });
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  },
};
