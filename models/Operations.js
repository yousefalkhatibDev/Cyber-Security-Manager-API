const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");
const Posts = require("./Posts");
const Targets = require("./Targets");
const Members = require("./Members");
const jwt = require("jsonwebtoken");

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
      const { Token } = req.body;
      let UserID = jwt.verify(Token, process.env.SECRET).id;

      const sqlQuery =
        "SELECT * FROM operations LEFT JOIN members ON members.m_operation=operations.o_id WHERE members.m_agent=? ORDER BY operations.o_create_date DESC";
      await pool.query(sqlQuery, [UserID], (err, results) => {
        if (err) console.log(err);
        if (results) {
          res.status(200).json({ data: results });
        }
      });
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
      } = req.body;

      let OperationID = CommonFunctions.Generate_Id();
      let OperationUser = jwt.verify(Token, process.env.SECRET).id;
      const date = new Date();

      OperationImage = OperationImage == true ? OperationImage : "";

      const sqlQuery = "INSERT INTO operations VALUES (?,?,?,?,?,?,?,?,?)";
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

  // remove posts, targets
  RemoveOperation: async (req, res) => {
    try {
      const { OperationID } = req.body;

      const sqlQuery = "DELETE FROM operations WHERE o_id=?";
      await pool.query(sqlQuery, [OperationID], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          let operation_posts = Posts.Remove_Posts_By_Operation_Internal(OperationID);
          let operation_targets =
            Targets.Remove_Targets_By_Operation_Internal(OperationID);
          if (operation_posts && operation_targets) {
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

  UpdateDescription: async (req, res) => {
    try {
      const { OperationID, OperationDescription } = req.body;

      const sqlQuery = "UPDATE operations SET o_description=? WHERE o_id=?";
      await pool.query(sqlQuery, [OperationDescription, OperationID], (err, results) => {
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

      const sqlQuery = "UPDATE operations SET o_name=? WHERE o_id=?";
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

  UpdateState: async (req, res) => {
    try {
      const { id, state } = req.body;

      const sqlQuery = "UPDATE operations SET o_state=? WHERE o_id=?";
      await pool.query(sqlQuery, [state, id], (err, results) => {
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

  Remove_Operation_By_User_Internal: async (o_user) => {
    try {
      const sqlQuery = "DELETE FROM operations WHERE o_user=?";
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
};
