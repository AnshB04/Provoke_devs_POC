// /models/subscription.js

const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
    stripeSubscriptionId: String,
    status: String, // 'active', 'canceled', etc.
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);