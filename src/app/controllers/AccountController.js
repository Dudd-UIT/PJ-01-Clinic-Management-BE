const {
  handleUserLogin,
  handleRegisterTK_BN,
  handleRegisterTK,
  handleVerify,
  handleConfirmUser,
} = require("../../services/UserService");
const db = require("../../config/db");
const {
  hashUserPassword,
  handleChangePassword,
} = require("../../services/UserService");

// GET /account/getUserAccount
const getUserAccount = async (req, res) => {
  return res.status(200).json({
    errcode: 0,
    message: "Get user accout successfully.",
    data: {
      access_token: req.token,
      roles: req.user.roles,
      username: req.user.username,
      groupName: req.user.groupName,
      groupID: req.user.groupID,
      userInfo: req.user.userInfo,
    },
  });
};

// GET /account/getAllAccount
const getAllAccount = async (req, res) => {
  try {
    const sqlQuery = `SELECT NH.TENNHOM, NH.MANHOM, TK.USERNAME, 
    CASE 
        WHEN B.MABS IS NOT NULL THEN B.MABS
        ELSE NULL
    END AS MABS,
    CASE 
        WHEN L.MALT IS NOT NULL THEN L.MALT
        ELSE NULL
    END AS MALT,
    CASE 
        WHEN B.MATK IS NOT NULL THEN B.MATK
        WHEN L.MATK IS NOT NULL THEN L.MATK
        ELSE NULL
    END AS MATK,
    CASE 
        WHEN B.HOTEN IS NOT NULL THEN B.HOTEN
        WHEN L.HOTEN IS NOT NULL THEN L.HOTEN
        ELSE NULL
    END AS HOTEN,
    CASE 
        WHEN B.CCCD IS NOT NULL THEN B.CCCD
        WHEN L.CCCD IS NOT NULL THEN L.CCCD
        ELSE NULL
    END AS CCCD,
    CASE 
        WHEN B.GIOITINH IS NOT NULL THEN B.GIOITINH
        WHEN L.GIOITINH IS NOT NULL THEN L.GIOITINH
        ELSE NULL
    END AS GIOITINH,
    CASE 
        WHEN B.SDT IS NOT NULL THEN B.SDT
        WHEN L.SDT IS NOT NULL THEN L.SDT
        ELSE NULL
    END AS SDT,
    CASE 
        WHEN B.NGAYSINH IS NOT NULL THEN B.NGAYSINH
        WHEN L.NGAYSINH IS NOT NULL THEN L.NGAYSINH
        ELSE NULL
    END AS NGAYSINH,
    CASE 
        WHEN B.DIACHI IS NOT NULL THEN B.DIACHI
        WHEN L.DIACHI IS NOT NULL THEN L.DIACHI
        ELSE NULL
    END AS DIACHI,
    CASE 
        WHEN B.TRINHDO IS NOT NULL THEN B.TRINHDO
        ELSE NULL
    END AS TRINHDO,
    CASE 
        WHEN B.CHUYENKHOA IS NOT NULL THEN B.CHUYENKHOA
        ELSE NULL
    END AS CHUYENKHOA
    FROM NHOM NH
    JOIN TAIKHOAN TK ON NH.MANHOM = TK.MANHOM
    LEFT JOIN BACSI B ON TK.MATK = B.MATK
    LEFT JOIN LETAN L ON TK.MATK = L.MATK
    WHERE NH.MANHOM NOT IN (1, 4)
    AND TRANGTHAI = 1`;

    const DSTK = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: DSTK,
    });
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({
      errcode: -1,
      message: "Error from server",
      data: [],
    });
  }
};

// GET /account/getAllUserGroup
const getAllUserGroup = async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM NHOM`;

    const groups = await db.executeQuery(sqlQuery);

    res.status(200).json({
      errcode: 0,
      message: "Successful",
      data: groups,
    });
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({
      errcode: -1,
      message: "Error from server",
      data: [],
    });
  }
};

// POST /account/login
const login = async (req, res) => {
  console.log(req.body);
  try {
    let Data = await handleUserLogin(req.body);

    if (Data && Data.data && Data.data.access_token) {
      res.cookie("jwt", Data.data.access_token, {
        httpOnly: true,
        maxAge: process.env.JWT_EXPIRES_IN,
      });
    }

    return res.status(200).json({
      errcode: Data.errcode,
      message: Data.message,
      data: Data.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errcode: "-1",
      message: "error from server",
      data: [],
    });
  }
};

// POST /account/verify
const verify = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  try {
    const Data = await handleVerify(email);
    console.log("Data", Data);

    res.status(200).json({
      errcode: Data.errcode,
      message: Data.message,
      data: Data.data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errcode: "-1",
      message: "Lỗi ở server",
      data: "",
    });
  }
};

// POST /account/confirm
const confirmUser = async (req, res) => {
  console.log(req.body);
  try {
    const Data = await handleConfirmUser(req.body);
    console.log("Data", Data);

    res.status(200).json({
      errcode: Data.errcode,
      message: Data.message,
      data: Data.data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errcode: "-1",
      message: "Lỗi ở server",
      data: [],
    });
  }
};

// POST /account/register/tk-bn
const registerTK_BN = async (req, res) => {
  console.log(req.body);

  try {
    let Data = await handleRegisterTK_BN(req.body);

    return res.status(200).json({
      errcode: Data.errcode,
      message: Data.message,
      data: Data.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errcode: "-1",
      message: "error from server",
      data: [],
    });
  }
};

// POST /account/register/tk
const registerTK = async (req, res) => {
  console.log(req.body);

  try {
    let Data = await handleRegisterTK(req.body);

    return res.status(200).json({
      errcode: Data.errcode,
      message: Data.message,
      data: Data.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errcode: "-1",
      message: "error from server",
      data: [],
    });
  }
};

// POST /account/logout
const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({
      errcode: 0,
      message: "clear cookies done!",
      data: "",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errcode: -1,
      message: "error from server",
      data: [],
    });
  }
};

// POST /account/changePassword
const changePassword = async (req, res) => {
  try {
    let Data = await handleChangePassword(req.body);

    return res.status(200).json({
      errcode: Data.errcode,
      message: Data.message,
      data: Data.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errcode: "-1",
      message: "error from server",
      data: [],
    });
  }
};

// POST /account/insert (chỉ thêm BACSI và LETAN)
const registerAccount = async (req, res) => {
  const {
    username,
    password,
    hoTen,
    vaiTro,
    chuyenKhoa,
    sdt,
    trinhDo,
    cccd,
    gioiTinh,
    ngaySinh,
    diaChi,
    ghiChu,
  } = req.body;
  const formattedNgaySinh = new Date(ngaySinh);
  const hashPass = hashUserPassword(password);

  if (vaiTro === 2 || vaiTro === "2") {
    try {
      const sqlQuery = ` 
        BEGIN
            INSERT_BACSI(:PAR_USERNAME, :PAR_PASSWORD, :par_HoTen, :par_cccd, :par_TrinhDo, :par_NgaySinh, :par_GioiTinh, :par_sdt, :par_DiaChi, :par_ChuyenKhoa);
        END;`;
      const bindVars = {
        PAR_USERNAME: username,
        PAR_PASSWORD: hashPass,
        par_HoTen: hoTen,
        par_cccd: cccd,
        par_TrinhDo: trinhDo,
        par_NgaySinh: formattedNgaySinh,
        par_GioiTinh: gioiTinh,
        par_sdt: sdt,
        par_DiaChi: diaChi,
        par_ChuyenKhoa: chuyenKhoa,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      res.status(200).json({
        errcode: 0,
        message: "Thêm bác sĩ thành công",
        data: "",
      });
    } catch (error) {
      console.error("Error calling procedure:", error);
      res.status(500).json({
        errcode: -1,
        message: "Lỗi ở server",
        data: "",
      });
    }
  } else {
    if (vaiTro === 3 || vaiTro === "3") {
      try {
        const sqlQuery = ` 
          BEGIN
              INSERT_LETAN(:PAR_USERNAME, :PAR_PASSWORD, :par_HoTen, :par_cccd, :par_DiaChi, :par_NgaySinh, :par_GioiTinh, :par_sdt);
          END;`;
        const bindVars = {
          PAR_USERNAME: username,
          PAR_PASSWORD: hashPass,
          par_HoTen: hoTen,
          par_cccd: cccd,
          par_DiaChi: diaChi,
          par_NgaySinh: formattedNgaySinh,
          par_GioiTinh: gioiTinh,
          par_sdt: sdt,
        };

        const result = await db.executeProcedure(sqlQuery, bindVars);

        res.status(200).json({
          errcode: 0,
          message: "Thêm lễ tân thành công",
          data: [],
        });
      } catch (error) {
        console.error("Error calling procedure:", error);
        res.status(500).json({
          errcode: -1,
          message: "Lỗi ở server",
          data: [],
        });
      }
    } else {
      res.status(500).json({
        errcode: -1,
        message: "Lỗi ở server",
        data: [],
      });
    }
  }
};

// POST /account/updateTTCN (chỉ cập nhật BACSI và LETAN)
const updateAccountTTCN = async (req, res) => {
  const {
    maBS,
    maLT,
    maTK,
    hoTen,
    vaiTro,
    sdt,
    trinhDo,
    chuyenKhoa,
    cccd,
    gioiTinh,
    ngaySinh,
    diaChi,
    ghiChu,
  } = req.body;

  const formattedNgaySinh = new Date(ngaySinh);

  if (vaiTro === 2 || vaiTro === "2") {
    try {
      const sqlQuery = ` 
        BEGIN
            UPDATE_BACSI(:par_Mabs, :par_Matk, :par_HoTen, :par_cccd, :par_TrinhDo, :par_NgaySinh, :par_GioiTinh, :par_sdt, :par_DiaChi, :par_ChuyenKhoa);
        END;`;
      const bindVars = {
        par_Mabs: maBS,
        par_Matk: maTK,
        par_HoTen: hoTen,
        par_cccd: cccd,
        par_TrinhDo: trinhDo,
        par_NgaySinh: formattedNgaySinh,
        par_GioiTinh: gioiTinh,
        par_sdt: sdt,
        par_DiaChi: diaChi,
        par_ChuyenKhoa: chuyenKhoa,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      res.status(200).json({
        errcode: 0,
        message: "Cập nhật thông tin bác sĩ thành công",
        data: "",
      });
    } catch (error) {
      console.error("Error calling procedure:", error);
      res.status(500).json({
        errcode: -1,
        message: "Lỗi ở server",
        data: "",
      });
    }
  } else {
    if (vaiTro === 3 || vaiTro === "3") {
      try {
        const sqlQuery = ` 
          BEGIN
              UPDATE_LETAN(:par_Malt, :par_Matk, :par_HoTen, :par_cccd, :par_DiaChi, :par_NgaySinh, :par_GioiTinh, :par_sdt);
          END;`;
        const bindVars = {
          par_Malt: maLT,
          par_Matk: maTK,
          par_HoTen: hoTen,
          par_cccd: cccd,
          par_DiaChi: diaChi,
          par_NgaySinh: formattedNgaySinh,
          par_GioiTinh: gioiTinh,
          par_sdt: sdt,
        };

        const result = await db.executeProcedure(sqlQuery, bindVars);

        res.status(200).json({
          errcode: 0,
          message: "Cập nhật thông tin lễ tân thành công",
          data: [],
        });
      } catch (error) {
        console.error("Error calling procedure:", error);
        res.status(500).json({
          errcode: -1,
          message: "Lỗi ở server",
          data: [],
        });
      }
    } else {
      res.status(500).json({
        errcode: -1,
        message: "Lỗi ở server",
        data: [],
      });
    }
  }
};

// POST /account/updateTTTK (chỉ cập nhật BACSI và LETAN)
const updateAccountTTTK = async (req, res) => {
  const { maTK, username, password } = req.body;
  const hashPass = hashUserPassword(password);

  try {
    const sqlQuery = ` 
      BEGIN
          UPDATE_TAIKHOAN(:PAR_MATK, :PAR_USERNAME, :PAR_PASSWORD);
      END;`;
    const bindVars = {
      PAR_MATK: maTK,
      PAR_USERNAME: username,
      PAR_PASSWORD: hashPass,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Cập nhật tài khoản thành công",
      data: "",
    });
  } catch (error) {
    console.error("Error calling procedure:", error);
    res.status(500).json({
      errcode: -1,
      message: "Lỗi ở server",
      data: "",
    });
  }
};

// POST /account/delete
const deleteAccount = async (req, res) => {
  const { maTK } = req.body;

  try {
    const sqlQuery = ` 
      BEGIN
        DELETE_TAIKHOAN(:PAR_MATK);
      END;`;
    const bindVars = {
      PAR_MATK: maTK,
    };

    const result = await db.executeProcedure(sqlQuery, bindVars);

    res.status(200).json({
      errcode: 0,
      message: "Xóa tài khoản thành công",
      data: "",
    });
  } catch (error) {
    console.error("Error calling procedure:", error);
    res.status(500).json({
      errcode: -1,
      message: "Lỗi ở server",
      data: "",
    });
  }
};

module.exports = {
  getUserAccount,
  getAllAccount,
  getAllUserGroup,
  login,
  verify,
  confirmUser,
  registerTK_BN,
  registerTK,
  logout,
  changePassword,
  registerAccount,
  updateAccountTTCN,
  updateAccountTTTK,
  deleteAccount,
};
