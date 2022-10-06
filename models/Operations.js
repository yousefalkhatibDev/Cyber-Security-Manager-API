const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");
const Posts = require("./Posts");
const Targets = require("./Targets");
const Members = require("./Members");
const Tasks = require("./Tasks");
const jwt = require("jsonwebtoken");
const fs = require("fs");
var path = require("path");

function decodeBase64Image(dataString) {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], "base64");

  return response;
}

// function to encode file data to base64 encoded string
function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString("base64");
}

let base64String;

module.exports = {
  GetOperationInfo: async (req, res) => {
    try {
      const { OperationID } = req.body;

      const sqlQuery = "SELECT * FROM operations WHERE o_id=?";
      await pool.query(sqlQuery, [OperationID], (err, results) => {
        if (err) console.log(err);
        if (results) {
          res.status(200).json({ data: results });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  GetOperations: async (req, res) => {
    try {
      const { Token, search } = req.body;
      let UserID = jwt.verify(Token, process.env.SECRET).id;

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
            if (err) console.log(err);
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
          if (err) console.log(err);
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
      let {
        Token,
        OperationName,
        OperationPassword,
        OperationDescription,
        OperationImage,
        OperationState,
        FileName,
      } = req.body;

      let OperationID = CommonFunctions.Generate_Id();
      let OperationUser = jwt.verify(Token, process.env.SECRET).id;
      const date = new Date();

      const sqlQuery = `INSERT INTO operations VALUES (?,?,?,?,?,?,?,?,?)`;
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
        ],
        (err, results) => {
          if (err) console.error(err);
          if (results.affectedRows) {
            let AddTheUserAsMember = Members.Add_Member_Internal(
              OperationUser,
              OperationID
            );
            if (AddTheUserAsMember) {
              res.status(200).json({ data: true });
            }
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
        if (err) console.log(err);
        if (results.length > 0) {
          res.status(200).json({ data: results[0] });
        } else {
          res.status(200).json({ data: false });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // remove posts, targets
  RemoveOperation: async (req, res) => {
    try {
      const { OperationID } = req.body;

      const sqlQuery = `DELETE FROM operations WHERE o_id=?`;
      await pool.query(sqlQuery, [OperationID], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          let operation_posts =
            Posts.Remove_Posts_By_Operation_Internal(OperationID);
          let operation_targets =
            Targets.Remove_Targets_By_Operation_Internal(OperationID);

          let operation_tasks =
            Tasks.Remove_tasks_By_Operation_Internal(OperationID);

          if (operation_posts && operation_targets && operation_tasks) {
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

  UpdateOperationInfo: async (req, res) => {
    try {
      const { OperationID, OperationName, OperationDescription } = req.body;

      const sqlQuery = `UPDATE operations SET o_name=?, o_description=? WHERE o_id=?`;

      await pool.query(
        sqlQuery,
        [OperationName, OperationDescription, OperationID],
        (err, results) => {
          if (err) console.log(err);
          if (results.affectedRows) {
            res.status(200).json({ data: true });
          } else {
            res.status(500).json({ data: false });
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
          if (err) console.log(err);
          if (results.affectedRows) {
            res.status(200).json({ data: true });
          } else {
            res.status(500).json({ data: false });
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
        if (err) console.log(err);
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

      const sqlQuery = `SELECT count(*)  AS MembersCount FROM members WHERE m_operation=?`;
      await pool.query(sqlQuery, [OperationID], (err, results) => {
        if (err) console.log(err);
        if (results) {
          res.status(200).json({ data: results });
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
        if (err) console.log(err);
        if (results) {
          res.status(200).json({ data: results });
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
        if (err) console.log(err);
        if (results) {
          res.status(200).json({ data: results });
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  },
};
