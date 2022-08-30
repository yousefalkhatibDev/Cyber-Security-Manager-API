const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");

module.exports = {
  GetRelations: async (req, res) => {
    try {
      const { TargetID } = req.body;

      let sqlQuery =
        "SELECT * FROM relations INNER JOIN targets ON targets.t_id=relations.r_related_target WHERE relations.r_target=? ORDER BY targets.t_create_date DESC";
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

  GetRelatedByTargets: async (req, res) => {
    try {
      const { TargetID } = req.body;

      let sqlQuery =
        "SELECT * FROM relations INNER JOIN targets ON targets.t_id=relations.r_target WHERE relations.r_related_target=? ORDER BY targets.t_create_date DESC;";
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

  AddRelation: async (req, res) => {
    try {
      const {
        RelationType,
        RelationUser,
        RelationRelatedTarget,
        RelationDescription,
        RelationTarget,
      } = req.body;

      let RelationID = CommonFunctions.Generate_Id();
      const date = new Date();

      const sqlQuery = "INSERT INTO relations VALUES (?,?,?,?,?,?,?,?)";
      await pool.query(
        sqlQuery,
        [
          RelationID,
          RelationTarget,
          RelationRelatedTarget,
          RelationType,
          RelationDescription,
          RelationUser,
          date,
          date,
        ],
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

  // RemoveRelation: async (req, res) => {
  //   try {
  //     const { c_id } = req.body;

  //     const sqlQuery = "DELETE FROM relations WHERE r_id=?";
  //     await pool.query(sqlQuery, [c_id], (err, results) => {
  //       if (err) console.log(err);
  //       if (results.affectedRows) {
  //         res.status(200).json({ data: true });
  //       }
  //     });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // },
};
