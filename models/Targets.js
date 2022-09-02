const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");
const Notes = require("./Notes");
const jwt = require("jsonwebtoken");

module.exports = {
  GetTargetInfo: async (req, res) => {
    try {
      const { TargetID } = req.body;

      const sqlQuery = "SELECT * FROM targets WHERE t_id=?";
      await pool.query(sqlQuery, [TargetID], (err, results) => {
        if (err) console.log(err);
        if (results) {
          res.status(200).json({ data: results });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  GetTargets: async (req, res) => {
    try {
      const { OperationID } = req.body;

      const sqlQuery = "SELECT * FROM targets LEFT JOIN users ON targets.t_user=users.u_id WHERE targets.t_operation=? ORDER BY targets.t_create_date DESC";

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

  GetTargetsByUser: async (req, res) => {
    try {
      const { Token } = req.body;
      let UserID = jwt.verify(Token, process.env.SECRET).id

      const sqlQuery = "SELECT * FROM targets LEFT JOIN operations ON targets.t_operation=operations.o_id WHERE targets.t_user=? ORDER BY targets.t_create_date DESC";

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

  AddTarget: async (req, res) => {
    try {
      let {
        TargetOperation,
        TargetName,
        Token,
        TargetType,
        TargetImage,
        TargetDescription,
        TargetLocation,
      } = req.body;

      let TargetID = CommonFunctions.Generate_Id();
      let TargetUser = jwt.verify(Token, process.env.SECRET).id;
      const date = new Date();

      TargetImage = TargetImage == true ? TargetImage : "";

      const sqlQuery = "INSERT INTO targets VALUES (?,?,?,?,?,?,?,?,?,?)";
      await pool.query(
        sqlQuery,
        [
          TargetID,
          TargetUser,
          TargetOperation,
          TargetName,
          TargetType,
          TargetImage,
          TargetDescription,
          TargetLocation,
          date,
          date,
        ],
        (err, results) => {
          if (err) console.log(err);
          if (results.affectedRows) {
            console.log(results);
            res.status(200).json({ data: true });
          } else {
            res.status(500).json({ error: false });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  RemoveTarget: async (req, res) => {
    try {
      const { id, user } = req.body;

      const sqlQuery = "DELETE FROM targets WHERE t_id=? AND t_user=?";
      await pool.query(sqlQuery, [id, user], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          let target_notes = Notes.Remove_Notes_By_Target_Internal(id);
          if (target_notes) {
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

  UpdateName: async (req, res) => {
    try {
      const { id, name } = req.body;

      const sqlQuery = "UPDATE targets SET t_name=? WHERE t_id=?";
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

  UpdateType: async (req, res) => {
    try {
      const { id, type } = req.body;

      const sqlQuery = "UPDATE targets SET t_type=? WHERE t_id=?";
      await pool.query(sqlQuery, [type, id], (err, results) => {
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

  UpdateDescription: async (req, res) => {
    try {
      const { id, description } = req.body;

      const sqlQuery = "UPDATE targets SET t_description=? WHERE t_id=?";
      await pool.query(sqlQuery, [description, id], (err, results) => {
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

  UpdateLocation: async (req, res) => {
    try {
      const { id, location } = req.body;

      const sqlQuery = "UPDATE targets SET t_location=? WHERE t_id=?";
      await pool.query(sqlQuery, [location, id], (err, results) => {
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

  Remove_Targets_By_Operation_Internal: async (o_id) => {
    try {
      const sqlQuery = "DELETE FROM targets WHERE t_operation=?";
      await pool.query(sqlQuery, [o_id], (err, results) => {
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
