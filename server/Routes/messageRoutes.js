const express = require('express');
const {
  allMessages,
  sendMessages,
} =require("../Controllers/messageControllers");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect,allMessages);
router.route("/").post(protect, sendMessages);

module.exports = router;