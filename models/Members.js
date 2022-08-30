const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");

module.exports = {
  GetMembers: async (req, res) => {
    try {
      const { OperationID } = req.body;

      let sqlQuery =
        "SELECT * FROM cts.members INNER JOIN users ON users.u_id=members.m_agent WHERE members.m_operation=? ORDER BY members.m_create_date DESC";
      await pool.query(sqlQuery, [OperationID], (err, results) => {
        if (err) console.log(err);
        if (results) {
          res.header("Access-Control-Allow-Origin", "*");
          res.status(200).json({ data: results });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  AddMember: async (req, res) => {
    try {
      let { MemeberAgent, MemeberOperation, MemeberUser } = req.body;

      let MemeberID = CommonFunctions.Generate_Id();
      const date = new Date();

      const sqlQuery = "INSERT INTO members VALUES (?,?,?,?,?,?)";
      await pool.query(
        sqlQuery,
        [MemeberID, MemeberOperation, MemeberUser, MemeberAgent, date, date],
        (err, results) => {
          if (err) console.error(err);
          if (results.affectedRows) {
            res.status(200).json({ data: true });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Add_Member_Internal: async (MemeberAgent, MemeberOperation) => {
    try {
      let MemeberID = CommonFunctions.Generate_Id();
      const date = new Date();

      const sqlQuery = "INSERT INTO members VALUES (?,?,?,?,?,?)";
      await pool.query(
        sqlQuery,
        [
          MemeberID,
          MemeberOperation,
          "internal API function",
          MemeberAgent,
          date,
          date,
        ],
        (err, results) => {
          if (err) console.error(err);
          if (results.affectedRows) {
            return true;
          }
        }
      );
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },
};
