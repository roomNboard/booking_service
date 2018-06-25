const preDb = require('./db');


const query = async (sqls) => {
  const db = await preDb;
  const responses = [];
  for (let sql of sqls) {
    const response = db.query(sql);
    responses.push(await response);
  };
  return responses;
};

module.exports = {
  query,
};
