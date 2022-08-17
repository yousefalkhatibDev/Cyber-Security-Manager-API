const { v4: uuidv4 } = require("uuid");

module.exports = {
  Generate_Id: () => {
    return uuidv4().substring(0, 10);
  },
};
