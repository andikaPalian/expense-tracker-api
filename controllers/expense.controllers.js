const mongoose = require("mongoose");
const Expense = require("../models/expense.models");

// ADD NEW EXPENSE
const addNewExpense = async (req, res) => {
    try {
        const {title, amount, category, date, notes} = req.body;
        if (!title || !amount || !category || !date) {
            return res.status(400).json({message: "Please fill all the fields"});
        };
        const expense = new Expense({
            title,
            amount,
            category,
            date,
            notes,
            userId: req.user.id
        });
        await expense.save();
        res.status(200).json({message: "Expense added successfully", expense});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error", error});
    };
};

module.exports = {addNewExpense};