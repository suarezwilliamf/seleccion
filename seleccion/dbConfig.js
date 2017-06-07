module.exports = {
  user          : "system",
  password      : "stallion",
  connectString : "localhost/XE",
  externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
};
