const pool = require('../helper/database').pool;
const CommonFunctions = require('../helper/CommonFunctions');
const jwt = require('jsonwebtoken');

module.exports = {
  GetTasks: async (req, res) => {
    try {
      const { OperationID, search } = req.body;

      if (search) {
        const searchTerm = `%`.concat(search.concat(`%`));
        const sqlQuery = `SELECT * FROM tasks INNER JOIN users ON users.u_id=tasks.tk_agent
                          WHERE tasks.tk_operation=? AND (tasks.tk_title LIKE ? OR tasks.tk_content LIKE ?) ORDER BY tasks.tk_create_date DESC`;

        await pool.query(sqlQuery, [OperationID, searchTerm, searchTerm], (err, results) => {
            if (err) res.status(200).json({ ErrorMessage: `Error While Getting Tasks` });
            if (results) res.status(200).json({ data: results });
            else res.status(200).json({ ErrorMessage: `Error While Getting Tasks` });
          }
        );
      } else {
        const sqlQuery = `SELECT * FROM tasks INNER JOIN users ON users.u_id=tasks.tk_agent WHERE tasks.tk_operation=? ORDER BY tasks.tk_create_date DESC`;

        await pool.query(sqlQuery, [OperationID], (err, results) => {
          if (err) res.status(200).json({ ErrorMessage: `Error While Getting Tasks` });
          if (results) res.status(200).json({ data: results });
          else res.status(200).json({ ErrorMessage: `Error While Getting Tasks` });
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  AddTask: async (req, res) => {
    try {
      const {
        Token,
        TaskAgent,
        TaskTitle,
        TaskContent,
        TaskState,
        TaskOperation,
      } = req.body;
      const TaskID = CommonFunctions.Generate_Id();
      const TaskUser = jwt.verify(Token, process.env.SECRET).id;
      const date = new Date();
      const sqlQuery = `INSERT INTO tasks VALUES (?,?,?,?,?,?,?,?,?)`;

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
          if (err) res.status(200).json({ ErrorMessage: `Error While Adding Task` });
          if (results.affectedRows) res.status(200).json({ data: true });
          else res.status(200).json({ ErrorMessage: `Error While Adding Task` });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  RemoveTask: async (req, res) => {
    try {
      const { TaskID } = req.body;
      const sqlQuery = `DELETE FROM tasks WHERE tk_id=?`;

      await pool.query(sqlQuery, [TaskID], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: `Error While Removing Task` });
        if (results.affectedRows) res.status(200).json({ data: true });
        else res.status(200).json({ ErrorMessage: `Error While Removing Task` });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  GetTasksByAgent: async (req, res) => {
    try {
      const { TaskOperation, Token } = req.body;
      const TaskUser = jwt.verify(Token, process.env.SECRET).id;
      const sqlQuery = `SELECT * FROM tasks INNER JOIN users ON users.u_id=tasks.tk_agent WHERE tasks.tk_operation=? AND tasks.tk_agent=?
                        ORDER BY tasks.tk_create_date DESC`;

      await pool.query(sqlQuery, [TaskOperation, TaskUser], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: `Error While Getting Tasks By Agent` });
        if (results) res.status(200).json({ data: results });
        else res.status(200).json({ ErrorMessage: `Error While Getting Tasks By Agent` });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  UpdateTaskState: async (req, res) => {
    try {
      const { TaskID, TaskStatus } = req.body;
      const sqlQuery = `UPDATE tasks SET tk_state=?, tk_update_date=? WHERE tk_id=?`;
      const date = new Date();

      await pool.query(sqlQuery, [TaskStatus, date, TaskID], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: `Error While Updating Task Status` });
        if (results) res.status(200).json({ data: results });
        else res.status(200).json({ ErrorMessage: `Error While Updating Task Status` });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Remove_Tasks_By_Operation_Internal: async (t_opeartion) => {
    try {
      const sqlQuery = `DELETE FROM tasks WHERE tk_operation=?`;

      await pool.query(sqlQuery, [t_opeartion], (err, results) => {
        if (err) res.status(200).json({ ErrorMessage: `Error While Removing Tasks By Operation ( Internal )` });
        if (results.affectedRows) return true;
        else return false;
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
