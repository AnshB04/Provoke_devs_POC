// /routes/plans.js

const express = require('express');
const router = express.Router();
const Plan = require('../models/plan');

router.get('/', (req, res) => {
    Plan.find({}, (err, plans) => {
        if (err) return res.status(500).send(err);
        res.render('plans', { plans });
    });
});

router.post('/', (req, res) => {
    const { name, description, price, interval } = req.body;
    const plan = new Plan({ name, description, price, interval });
    plan.save(err => {
        if (err) return res.status(500).send(err);
        res.redirect('/plans');
    });
});

module.exports = router;