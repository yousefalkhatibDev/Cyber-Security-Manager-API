const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");
const jwt = require("jsonwebtoken");

module.exports = {
  GetNotes: async (req, res) => {
    try {
      const { TargetID, SearchNotes } = req.body;

      if (SearchNotes) {
        const searchTerm = "%".concat(SearchNotes.concat("%"));
        const sqlQuery = `SELECT * FROM notes INNER JOIN users ON notes.n_user=users.u_id WHERE notes.n_target=? AND (notes.n_title
                          LIKE ? OR notes.n_text LIKE ? OR notes.n_type LIKE ?) ORDER BY notes.n_create_date DESC`;

        await pool.query(sqlQuery, [TargetID, searchTerm, searchTerm, searchTerm], (err, results) => {
            if (err) res.status(200).json({ ErrorMessage: "Error While Getting Notes" }); 
            if (results) res.status(200).json({ data: results });
          }
        );
      } else {
        const sqlQuery = `SELECT * FROM notes INNER JOIN users ON notes.n_user=users.u_id WHERE notes.n_target=? ORDER BY notes.n_create_date DESC`;

        await pool.query(sqlQuery, [TargetID], (err, results) => {
          if (err) res.status(200).json({ ErrorMessage: "Error While Getting Comments" });
          if (results) res.status(200).json({ data: results });
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  AddNote: async (req, res) => {
    try {
      const {
        NoteTarget,
        NoteOperation,
        NoteType,
        NoteTitle,
        NoteText,
        Token,
      } = req.body;
      const NoteID = CommonFunctions.Generate_Id();
      const NoteUser = jwt.verify(Token, process.env.SECRET).id;
      const date = new Date();
      const sqlQuery = "INSERT INTO notes VALUES (?,?,?,?,?,?,?,?,?)";
      
      await pool.query(
        sqlQuery,
        [
          NoteID,
          NoteUser,
          NoteTarget,
          NoteOperation,
          NoteType,
          NoteTitle,
          NoteText,
          date,
          date,
        ],
        (err, results) => {
          if (err) res.status(200).json({ ErrorMessage: "Error While Adding Note" });
          if (results.affectedRows) res.status(200).json({ data: true });
          else res.status(200).json({ ErrorMessage: "Error While Adding Note" });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  RemoveNote: async (req, res) => {
    try {
      const { NoteID } = req.body;
      const sqlQuery = "DELETE FROM notes WHERE n_id=?";

      await pool.query(sqlQuery, [NoteID], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: "Error While Removing Note" });
        if (results.affectedRows) res.status(200).json({ data: true });
        else res.status(200).json({ ErrorMessage: "Error While Removing Note" });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Remove_Notes_By_Target_Internal: async (TargetID) => {
    try {
      const sqlQuery = "DELETE FROM notes WHERE n_target=?";
      
      await pool.query(sqlQuery, [t_id], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: "Error While Removing Note" });
        if (results.affectedRows) return true;
        else return false;
      });
    } catch (error) {
      return error.message;
    }
  },
};
