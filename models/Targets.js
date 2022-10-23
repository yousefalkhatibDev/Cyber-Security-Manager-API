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
        if (err) {
          console.log(err);
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Target Info" });
        }
        if (results.length > 0) {
          res.status(200).json({ data: results });
        } else {
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Target Info" });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  GetTargets: async (req, res) => {
    try {
      const { OperationID, search } = req.body;

      if (search) {
        var searchTerm = "%".concat(search.concat("%"));
        const sqlQuery = `SELECT * FROM targets LEFT JOIN users ON targets.t_user=users.u_id WHERE targets.t_operation=? AND (targets.t_name
              LIKE ? OR targets.t_description LIKE ?) ORDER BY targets.t_create_date DESC `;

        await pool.query(
          sqlQuery,
          [OperationID, searchTerm, searchTerm],
          (err, results) => {
            if (err) {
              console.log(err);
              res
                .status(200)
                .json({ ErrorMessage: "Error While Getting Targets" });
            }
            if (results) {
              res.status(200).json({ data: results });
            } else {
              res
                .status(200)
                .json({ ErrorMessage: "Error While Getting Targets" });
            }
          }
        );
      } else {
        const sqlQuery = `SELECT * FROM targets LEFT JOIN users ON targets.t_user=users.u_id
              WHERE targets.t_operation=? ORDER BY targets.t_create_date DESC`;

        await pool.query(sqlQuery, [OperationID], (err, results) => {
          if (err) {
            console.log(err);
            res
              .status(200)
              .json({ ErrorMessage: "Error While Getting Targets" });
          }
          if (results) {
            res.status(200).json({ data: results });
          } else {
            res
              .status(200)
              .json({ ErrorMessage: "Error While Getting Targets" });
          }
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  GetTargetsByUser: async (req, res) => {
    try {
      const { Token, search } = req.body;
      const UserID = jwt.verify(Token, process.env.SECRET).id;

      if (search) {
        var searchTerm = "%".concat(search.concat("%"));
        const sqlQuery = `SELECT * FROM targets LEFT JOIN users ON targets.t_user=users.u_id WHERE targets.t_user=? AND (targets.t_name
                LIKE ? OR targets.t_description LIKE ?) ORDER BY targets.t_create_date DESC `;

        await pool.query(
          sqlQuery,
          [UserID, searchTerm, searchTerm],
          (err, results) => {
            if (err) {
              console.log(err);
              res
                .status(200)
                .json({ ErrorMessage: "Error While Getting Targets" });
            }
            if (results) {
              res.status(200).json({ data: results });
            } else {
              res
                .status(200)
                .json({ ErrorMessage: "Error While Getting Targets" });
            }
          }
        );
      } else {
        const sqlQuery = `SELECT * FROM targets LEFT JOIN operations ON targets.t_operation=operations.o_id
                    WHERE targets.t_user=? ORDER BY targets.t_create_date DESC`;

        await pool.query(sqlQuery, [UserID], (err, results) => {
          if (err) {
            console.log(err);
            res
              .status(200)
              .json({ ErrorMessage: "Error While Getting Targets" });
          }
          if (results) {
            res.status(200).json({ data: results });
          } else {
            res
              .status(200)
              .json({ ErrorMessage: "Error While Getting Targets" });
          }
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  AddTarget: async (req, res) => {
    try {
      let {
        Token,
        TargetOperation,
        TargetName,
        TargetType,
        TargetDescription,
        TargetLocation,
        Base64State,
      } = req.body;

      let TargetID = CommonFunctions.Generate_Id();
      let TargetUser = jwt.verify(Token, process.env.SECRET).id;
      const date = new Date();

      const sqlQuery = "INSERT INTO targets VALUES (?,?,?,?,?,?,?,?,?,?,?)";
      await pool.query(
        sqlQuery,
        [
          TargetID,
          TargetUser,
          TargetOperation,
          TargetName,
          TargetType,
          Base64State,
          TargetDescription,
          TargetLocation,
          date,
          date,
          null,
        ],
        (err, results) => {
          if (err) {
            console.log(err);
            res.status(200).json({ ErrorMessage: "Error While Adding Target" });
          }
          if (results.affectedRows) {
            res.status(200).json({ data: true });
          } else {
            res.status(200).json({ ErrorMessage: "Error While Adding Target" });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  RemoveTarget: async (req, res) => {
    try {
      const { TargetID } = req.body;

      const sqlQuery = "DELETE FROM targets WHERE t_id=?";
      await pool.query(sqlQuery, [TargetID], (err, results) => {
        if (err) {
          console.log(err);
          res.status(200).json({ ErrorMessage: "Error While Removing Target" });
        }
        if (results.affectedRows) {
          let target_notes = Notes.Remove_Notes_By_Target_Internal(TargetID);
          if (target_notes) {
            res.status(200).json({ data: true });
          } else {
            res
              .status(200)
              .json({ ErrorMessage: "Error While Removing Target" });
          }
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  GetTargetImage: async (req, res) => {
    try {
      const { TargetID } = req.body;

      const sqlQuery = `SELECT t_image FROM targets WHERE t_id=?`;
      await pool.query(sqlQuery, [TargetID], (err, results) => {
        if (err) {
          console.log(err);
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Target Image" });
        }
        if (results.length > 0) {
          res.status(200).json({ data: results[0] });
        } else {
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Target Image" });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  UpdateTargetInfo: async (req, res) => {
    try {
      const {
        TargetID,
        TargetName,
        TargetDescription,
        TargetType,
        TargetLocation,
      } = req.body;

      const sqlQuery = `UPDATE targets SET t_name=?, t_description=?, t_location=? WHERE t_id=?`;
      await pool.query(
        sqlQuery,
        [TargetName, TargetDescription, TargetLocation, TargetID],
        (err, results) => {
          if (err) {
            console.log(err);
            res
              .status(200)
              .json({ ErrorMessage: "Error While Updating Target Info" });
          }
          if (results.affectedRows) {
            res.status(200).json({ data: true });
          } else {
            res
              .status(200)
              .json({ ErrorMessage: "Error While Updating Target Info" });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Remove_Targets_By_Operation_Internal: async (o_id) => {
    try {
      const sqlQuery = "DELETE FROM targets WHERE t_operation=?";
      await pool.query(sqlQuery, [o_id], (err, results) => {
        if (err) {
          console.log(err);
          res
            .status(200)
            .json({ ErrorMessage: "Error While Removing Target ( Internal )" });
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

  GetTargetNotesCount: async (req, res) => {
    try {
      const { TargetID } = req.body;

      const sqlQuery = `SELECT count(*) AS NotesCount FROM notes WHERE n_target=?`;
      await pool.query(sqlQuery, [TargetID], (err, results) => {
        if (err) {
          console.log(err);
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Target Notes Count" });
        }
        if (results.length > 0) {
          res.status(200).json({ data: results });
        } else {
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Target Notes Count" });
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  },

  GetLastAccessedTarget: async (req, res) => {
    try {
      const { Token } = req.body;
      const UserID = jwt.verify(Token, process.env.SECRET).id;
      const sqlQuery = `SELECT * FROM targets WHERE t_user=? ORDER BY t_last_access DESC LIMIT 1`;

      await pool.query(sqlQuery, [UserID], (err, results) => {
        if (err) {
          console.log(err);
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Last Accessed Target" });
        }
        if (results.length > 0) {
          res.status(200).json({ data: results });
        } else {
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Last Accessed Target" });
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  },

  SetLastAccessedTarget: async (req, res) => {
    try {
      const { TargetID } = req.body;
      const sqlQuery = `UPDATE targets SET t_last_access=? WHERE t_id=?`;
      const date = new Date();

      await pool.query(sqlQuery, [date, TargetID], (err, results) => {
        if (err) {
          console.log(err);
          res
            .status(200)
            .json({ ErrorMessage: "Error While Setting Last Accessed Target" });
        }
        if (results.affectedRows) {
          res.status(200).json({ data: true });
        } else {
          res
            .status(200)
            .json({ ErrorMessage: "Error While Setting Last Accessed Target" });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  GetTargetsCount: async (req, res) => {
    try {
      const { Token } = req.body;
      const UserID = jwt.verify(Token, process.env.SECRET).id;
      const sqlQuery = `SELECT count(*) AS TargetsCount FROM targets WHERE t_user=?`;

      await pool.query(sqlQuery, [UserID], (err, results) => {
        if (err) {
          console.log(err);
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Targets Count" });
        }
        if (results.length > 0) {
          res.status(200).json({ data: results });
        } else {
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Targets Count" });
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  },

  GetRecentTargets: async (p_opeartion) => {
    try {
      const { Token } = req.body;
      const UserID = jwt.verify(Token, process.env.SECRET).id;
      const sqlQuery = `SELECT * FROM 
            (SELECT o_id FROM operations LEFT JOIN members ON members.m_operation=operations.o_id 
            WHERE members.m_agent=?) AS UserOperations
            JOIN targets ON t_operation=UserOperations.o_id ORDER BY t_update_date DESC`;

      await pool.query(sqlQuery, [UserID], (err, results) => {
        if (err) {
          console.log(err);
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Recent Targets" });
        }
        if (results.affectedRows) {
          res.status(200).json({ data: results });
        } else {
          res
            .status(200)
            .json({ ErrorMessage: "Error While Getting Recent Targets" });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
