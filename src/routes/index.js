const siteRouter = require("./site");
const patientRouter = require("./patient");
const doctorRouter = require("./doctor");
const dichvuRouter = require("./dichvu");
const phieukhamRouter = require("./phieukham");
const donthuocRouter = require("./donthuoc");
const accountRouter = require("./account");
const hoadonRouter = require("./hoadon");
const clsRouter = require("./canlamsang");
const adminRouter = require("./admin");
const benhRouter = require("./benh");
const dvtRouter = require("./dvt");
const roleRouter = require("./role");
const thuocRouter = require("./thuoc");
const lothuocRouter = require("./lothuoc");

const {
  checkUserJWT,
  checkUserPermission,
} = require("../middleware/JWTAction");

function route(app) {
  app.use("*", checkUserJWT, checkUserPermission);

  app.use("/", siteRouter);

  app.use("/account", accountRouter);

  app.use("/benhnhan", patientRouter);

  app.use("/bacsi", doctorRouter);

  app.use("/dichvu", dichvuRouter);

  app.use("/phieukham", phieukhamRouter);

  app.use("/donthuoc", donthuocRouter);

  app.use("/thuoc", thuocRouter);

  app.use("/lothuoc", lothuocRouter);

  app.use("/hoadon", hoadonRouter);

  app.use("/cls", clsRouter);

  app.use("/admin", adminRouter);

  app.use("/benh", benhRouter);

  app.use("/dvt", dvtRouter);

  app.use("/role", roleRouter);
}

module.exports = route;
