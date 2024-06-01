const db = require("../../config/db");
const oracledb = require("oracledb");
const { format } = require("date-fns");
const { DateTime2 } = require("mssql");
const axios = require("axios");

class HoaDonController {
  // POST /hoadon/insert
  async insert(req, res) {
    const { maLT, maLHD, tttt, ...others } = req.body;
    try {
      const sqlQuery = `BEGIN
        INSERT_HOADON(:p_maLT, :p_maLHD, :p_tdtt, :p_tttt, :p_thanhTien, :p_pttt, :maHDOut);
      END;`;

      const bindVars = {
        p_maLT: maLT,
        p_maLHD: maLHD,
        p_tdtt: others?.tdtt ? new Date(others?.tdtt) : null,
        p_tttt: tttt,
        p_thanhTien: 0,
        p_pttt: others?.pttt || null,
        maHDOut: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Thêm hóa đơn mới thành công",
        MAHD: result.outBinds.maHDOut,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errcode: -1,
        message: "Lỗi ở server",
      });
    }
  }

  // POST /hoadon/thanhtoan
  async thanhToan(req, res) {
    const { MAHD, maLT, tdtt, tttt, THANHTIEN, pttt, ...others } = req.body;
    try {
      const sqlQuery = `BEGIN
        UPDATE_HOADON(:p_maHD, :p_maLT, :p_tdtt, :p_tttt, :p_thanhTien, :p_pttt);
      END;`;

      const bindVars = {
        p_maHD: MAHD,
        p_maLT: maLT,
        p_tdtt: new Date(tdtt),
        p_tttt: tttt,
        p_thanhTien: THANHTIEN,
        p_pttt: pttt,
      };

      const result = await db.executeProcedure(sqlQuery, bindVars);

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Thanh toán hóa đơn thành công",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errcode: -1,
        message: "Lỗi ở server",
      });
    }
  }

  // GET /hoadon/dshd/getById/:id-phieu-kham
  async fetchHDbyID(req, res) {
    try {
      const sqlQuery = `SELECT DISTINCT hd.MAHD, hd.MALOAIHD, lhd.TENLOAIHD, hd.THANHTIEN, hd.TTTT, hd.TDTT, hd.PTTT, lt.MALT, lt.HOTEN as TENLT
      FROM HOADON hd, PHIEUKHAM pk, KETQUADICHVUCLS cls, DONTHUOC dth, LOAIHD lhd, LETAN lt
      WHERE (hd.MAHD = pk.MAHD
      OR (pk.MAPK = dth.MAPK AND hd.MAHD = dth.MAHD)
      OR (pk.MAPK = cls.MAPK AND hd.MAHD = cls.MAHD) )
      AND hd.MALOAIHD = lhd.MALOAIHD
      AND hd.MALT = lt.MALT
      AND pk.MAPK = ${req.params.id}
      ORDER BY MALOAIHD ASC`;

      const hdList = await db.executeQuery(sqlQuery);

      if (hdList.length === 0) {
        res.status(200).json({
          errcode: 1,
          message: "No data found: Invalid MAPK",
          data: hdList,
        });
        return;
      }

      const formatedHdList = hdList.map((hdItem) => {
        const formatTime = hdItem.TDTT
          ? format(hdItem.TDTT, "dd/MM/yyyy - HH:mm")
          : hdItem.TDTT;
        return { ...hdItem, TDTT: formatTime };
      });

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Successful",
        data: formatedHdList,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errcode: -1,
        message: "Lỗi ở server",
      });
    }
  }

  // POST /hoadon/test-momo
  async testMOMO(req, res) {
    const { MAHD, TENLOAIDV, THANHTIEN, ...others } = req.body;
    try {
      var partnerCode = "MOMO";
      var accessKey = "F8BBA842ECF85";
      var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
      var requestId = partnerCode + new Date().getTime();
      var orderId = requestId;
      var orderInfo = "Thanh toán " + (TENLOAIDV || "Hóa đơn khám");
      var redirectUrl = "bcareful://dsdv";
      var ipnUrl = "192.168.1.21:3001/hoadon/momo-ipn";
      // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
      var amount = THANHTIEN / 10;
      var requestType = "captureWallet";
      var extraData = ""; //pass empty value if your merchant does not have stores

      //before sign HMAC SHA256 with format
      //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
      var rawSignature =
        "accessKey=" +
        accessKey +
        "&amount=" +
        amount +
        "&extraData=" +
        extraData +
        "&ipnUrl=" +
        ipnUrl +
        "&orderId=" +
        orderId +
        "&orderInfo=" +
        orderInfo +
        "&partnerCode=" +
        partnerCode +
        "&redirectUrl=" +
        redirectUrl +
        "&requestId=" +
        requestId +
        "&requestType=" +
        requestType;
      //puts raw signature
      console.log("--------------------RAW SIGNATURE----------------");
      console.log(rawSignature);
      //signature
      const crypto = require("crypto");
      var signature = crypto
        .createHmac("sha256", secretkey)
        .update(rawSignature)
        .digest("hex");
      console.log("--------------------SIGNATURE----------------");
      console.log(signature);

      const requestBody = {
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: "en",
      };

      const response = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/create",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Xử lý kết quả trả về
      res.status(200).json({
        errcode: 0,
        message: "Successful",
        data: response.data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errcode: -1,
        message: "Lỗi ở server",
      });
    }
  }

  // POST /hoadon/momo-ipn
  async momoIPN(req, res) {
    // const { resultCode, message, payType, responseTime, amount, ...others } =
    //   req.body;
    try {
      // Xử lý kết quả trả về
      console.log(req.body);
      res.status(204).json({
        errcode: 0,
        message: "Successful",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errcode: -1,
        message: "Lỗi ở server",
      });
    }
  }
}

module.exports = new HoaDonController();
