const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    title: {type: String, required: true},
    amount: {type: Number, required: true},
    category: {
        type: String,
        enum: ['Groceries', 'Leisure', 'Electronics', 'Utilities', 'Clothing', 'Health', 'Others'],
        required: true
    },
    date: {type: Date, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    notes: {type: String},
}, {
    timestamps: true,
});

module.exports = mongoose.model("Expense", expenseSchema);