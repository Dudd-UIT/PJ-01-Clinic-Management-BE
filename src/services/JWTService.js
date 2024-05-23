const db = require("../config/db");

const getGroupWithRoles = async (user) => {
  const userGroup = user[0].MANHOM;
  const sqlQuery = `SELECT N.MANHOM, TENNHOM, V.MAVAITRO, URL
    FROM NHOM N, VAITRO V, NHOM_VAITRO NV
    WHERE N.MANHOM = '${userGroup}'
    AND N.MANHOM = NV.MANHOM
    AND NV.MAVAITRO = V.MAVAITRO`;
  const roles = await db.executeQuery(sqlQuery);
  return roles ? roles : {};
};

const getUserInfo = async (user) => {
  const userGroup = user[0].MANHOM;
  const userId = user[0].MATK;
  let sqlQuery = "";
  switch (userGroup) {
    case 2:
      sqlQuery = `SELECT *
                  FROM BACSI
                  WHERE MATK = ${userId}`;
      break;
    case 3:
      sqlQuery = `SELECT *
                  FROM LETAN
                  WHERE MATK = ${userId}`;
      break;
    case 4:
      sqlQuery = `SELECT *
                  FROM BENHNHAN
                  WHERE MATK = ${userId}`;
      break;
    default:
      break;
  }
  let info = null;
  if (sqlQuery !== "") {
    info = await db.executeQuery(sqlQuery);
  }

  // if(info){
  //   const formattedInfo = {...info, NGAYSINH: new Date(NGAYSINH)}
  // }

  return info ? info : {};
};

module.exports = {
  getGroupWithRoles,
  getUserInfo,
};
