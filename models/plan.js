// /models/plan.js

const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    interval: String, // 'monthly' or 'yearly'
});

module.exports = mongoose.model('Plan', PlanSchema);