const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");
const Notes = require("./Notes");
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
      const { OperationID, search } = req.body;

      if (search) {
        var searchTerm = "%".concat(search.concat("%"));
        const sqlQuery = `SELECT * FROM targets 
              LEFT JOIN users ON targets.t_user=users.u_id
              WHERE targets.t_operation=? AND (targets.t_name
              LIKE ? OR targets.t_description LIKE ?)
              ORDER BY targets.t_create_date DESC `;

        await pool.query(
          sqlQuery,
          [OperationID, searchTerm, searchTerm],
          (err, results) => {
            if (err) console.log(err);
            if (results) {
              res.status(200).json({ data: results });
            }
          }
        );
      } else {
        const sqlQuery = `SELECT * FROM targets 
              LEFT JOIN users ON targets.t_user=users.u_id
              WHERE targets.t_operation=? 
              ORDER BY targets.t_create_date DESC`;

        await pool.query(sqlQuery, [OperationID], (err, results) => {
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

  GetTargetsByUser: async (req, res) => {
    try {
      const { Token, search } = req.body;
      let UserID = jwt.verify(Token, process.env.SECRET).id;

      if (search) {
        var searchTerm = "%".concat(search.concat("%"));
        const sqlQuery = `SELECT * FROM targets 
                LEFT JOIN users ON targets.t_user=users.u_id
                WHERE targets.t_user=? AND (targets.t_name
                LIKE ? OR targets.t_description LIKE ?)
                ORDER BY targets.t_create_date DESC `;

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
        const sqlQuery = `SELECT * FROM targets
                    LEFT JOIN operations ON targets.t_operation=operations.o_id
                    WHERE targets.t_user=?
                    ORDER BY targets.t_create_date DESC`;

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

  AddTarget: async (req, res) => {
    try {
      let {
        Token,
        TargetOperation,
        TargetName,
        TargetType,
        TargetImage,
        TargetDescription,
        TargetLocation,
        Base64State,
        FileName,
      } = req.body;

      let TargetID = CommonFunctions.Generate_Id();
      let TargetUser = jwt.verify(Token, process.env.SECRET).id;
      const date = new Date();

      if (Base64State) {
        const fileExt = FileName.split(".").pop();
        base64String = Base64State;
        const imageBuffer = decodeBase64Image(Base64State);
        if (fileExt === "pdf") {
          fs.writeFileSync(
            `./uploads/pdfs/${OperationID + "_" + FileName}`,
            imageBuffer.data,
            "base64",
            function (err) {
              console.log(err);
            }
          );
          Base64State = `./uploads/pdfs/${OperationID + "_" + FileName}`;
        } else {
          fs.writeFileSync(
            `./uploads/targets/${TargetID + "_" + FileName}`,
            imageBuffer.data,
            "base64",
            function (err) {
              console.log(err);
            }
          );
          Base64State = `./uploads/targets/${TargetID + "_" + FileName}`;
        }
      } else {
        Base64State = "";
      }

      const sqlQuery = "INSERT INTO targets VALUES (?,?,?,?,?,?,?,?,?,?)";
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
        ],
        (err, results) => {
          if (err) console.log(err);
          if (results.affectedRows) {
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
      const { TargetID } = req.body;

      const sqlQuery = "DELETE FROM targets WHERE t_id=?";
      await pool.query(sqlQuery, [TargetID], (err, results) => {
        if (err) console.log(err);
        if (results.affectedRows) {
          let target_notes = Notes.Remove_Notes_By_Target_Internal(TargetID);
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

  GetTargetImage: async (req, res) => {
    try {
      const { TargetID } = req.body;

      const sqlQuery = `SELECT t_image FROM targets WHERE t_id=?`;
      await pool.query(sqlQuery, [TargetID], (err, results) => {
        if (err) console.log(err);
        if (results[0].t_image !== "") {
          res.status(200).json({ data: base64_encode(results[0].t_image) });
        } else {
          res.status(200).json({ data: false });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  UpdateTargetInfo: async (req, res) => {
    try {
      const { TargetID, TargetName, TargetDescription, TargetType, TargetLocation } = req.body;

      const sqlQuery = "UPDATE targets SET t_name=?, t_description=?, t_location=? WHERE t_id=?";
      await pool.query(sqlQuery, [TargetName, TargetDescription, TargetLocation, TargetID], (err, results) => {
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

  GetTargetNotesCount: async (req, res) => {
    try {
      const { TargetID } = req.body;

      const sqlQuery = `SELECT count(*) AS NotesCount FROM notes WHERE n_target=?`;
      await pool.query(sqlQuery, [TargetID], (err, results) => {
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
