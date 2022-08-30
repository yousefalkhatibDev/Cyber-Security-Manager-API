const pool = require("../helper/database").pool;
const CommonFunctions = require("../helper/CommonFunctions");

module.exports = {
  GetTasks: async (req, res) => {
    try {
      const { OperationID } = req.body;

      let sqlQuery =
        "SELECT * FROM tasks INNER JOIN users ON users.u_id=tasks.tk_agent WHERE tasks.tk_operation=? ORDER BY tasks.tk_create_date DESC";
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

  AddTask: async (req, res) => {
    try {
      let {
        TaskUser,
        TaskAgent,
        TaskTitle,
        TaskContent,
        TaskState,
        TaskOperation,
      } = req.body;

      let TaskID = CommonFunctions.Generate_Id();
      const date = new Date();

      const sqlQuery = "INSERT INTO tasks VALUES (?,?,?,?,?,?,?,?,?)";
      await pool.query(
        sqlQuery,
        [
          TaskID,
          TaskUser,
          TaskAgent,
          TaskTitle,
          TaskContent,
          TaskState,
          date,
          date,
          TaskOperation,
        ],
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
};
