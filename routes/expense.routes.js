const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { addNewExpense, getAllExpenses, getSingleExpense, updateExpense, deleteExpense } = require("../controllers/expense.controllers");
const router = express.Router();

router.use(authMiddleware);
router.post("/add-expense", addNewExpense);
router.get("/get-expense", getAllExpenses);
router.get("/get-expense/:id", getSingleExpense);
router.put("/update-expense/:id", updateExpense);
router.delete("/delete-expense/:id", deleteExpense);

module.exports = router;