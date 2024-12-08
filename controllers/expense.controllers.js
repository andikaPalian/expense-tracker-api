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

// GET ALL EXPENSES
const getAllExpenses = async (req, res) => {
    try {
        const {filter, category, startDate, endDate} = req.query;
        const filters = {userId: req.user.id};
        // Filter berdasarkan waktu
        if (filter === "week") {
            filters.date = {$gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)};
        } else if (filter === "month") {
            filters.date = {$gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)};
        } else if (filter === "3months") {
            filters.date = {$gte: new Date(Date.now() = 90 * 24 * 60 * 60 * 1000)};
        } else if (startDate && endDate) {
            // Jika user memberikan tanggal custom, gunakan sebagai filter
            filters.date = {$gte: new Date(startDate), $lte: new Date(endDate)};
        };
        // Filter berdasarkan kategori
        if (category) {
            filters.category = category;
        };
        const expense = await Expense.find(filters);
        res.status(200).json({expense});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error", error});
    };
};

// GET SINGLE EXPENSE BY ID
const getSingleExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({message: "Expense not found"});
        };
        res.status(200).json({expense});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error", error});
    };
};

// UPDATE EXPENSE
const updateExpense = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid expense id"});
        };
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({message: 'Expense not found'});
        };
        if (expense.userId.toString() !== req.user.id) {
            return res.status(403).json({message: "You are not authorized to update this expense"});
        };
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json({message: "Expense updated successfully", updatedExpense});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error", error});
    };
};

// DELETE EXPENSE
const deleteExpense = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid expense id"});
        };
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) {
            return res.status(404).json({message: "Expense not found"});
        };
        if (expense.userId.toString() !== req.user.id) {
            return res.status(403).json({message: "You are not authorized to delete this expense"});
        };
        res.status(200).json({message: "Expense deleted successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error", error});
    };
};

module.exports = {addNewExpense, getAllExpenses, getSingleExpense, updateExpense, deleteExpense};