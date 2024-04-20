const express = require("express");
const router = express.Router();

const siteController = require("../app/controllers/SiteController");

router.get("/search", siteController.search);
router.get("/", siteController.index);
router.get("/dangky", siteController.dangky);
router.get("/lichhen", siteController.lichhen);

module.exports = router;
