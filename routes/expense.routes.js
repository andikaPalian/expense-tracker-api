const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { addNewExpense } = require("../controllers/expense.controllers");
const router = express.Router();

router.use(authMiddleware);
router.post("/add-expense", addNewExpense);

module.exports = router;