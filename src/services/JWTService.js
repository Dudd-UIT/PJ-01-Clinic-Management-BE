const db = require('../config/db')

const getGroupWithRoles = async (user) => {
    const userGroup = user[0].MANHOM;
    const sqlQuery = `SELECT N.MANHOM, TENNHOM, V.MAVAITRO, URL, MOTA
    FROM NHOM N, VAITRO V, NHOM_VAITRO NV
    WHERE N.MANHOM = '${userGroup}'
    AND N.MANHOM = NV.MANHOM
    AND NV.MAVAITRO = V.MAVAITRO`;
    const roles = await db.executeQuery(sqlQuery);
    return roles ? roles : {};
}

module.exports = {
    getGroupWithRoles
}