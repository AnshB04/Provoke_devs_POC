// /routes/subscriptions.js

const express = require('express');
const router = express.Router();
const stripe = require('stripe')('your_stripe_secret_key');
const Subscription = require('../models/subscription');

router.get('/', (req, res) => {
    Subscription.find({ user: req.user._id })
        .populate('plan')
        .exec((err, subscriptions) => {
            if (err) return res.status(500).send(err);
            res.render('subscriptions', { subscriptions });
        });
});

router.post('/', async(req, res) => {
    const { planId, paymentMethodId } = req.body;

    // Create a new customer if not exists
    let customer;
    if (!req.user.stripeCustomerId) {
        customer = await stripe.customers.create({
            payment_method: paymentMethodId,
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });
        req.user.stripeCustomerId = customer.id;
        req.user.save();
    }

    // Create a subscription
    const stripeSubscription = await stripe.subscriptions.create({
        customer: req.user.stripeCustomerId,
        items: [{ plan: planId }],
        expand: ['latest_invoice.payment_intent'],
    });

    // Save the subscription to your database
    const subscription = new Subscription({
        user: req.user._id,
        plan: planId,
        stripeSubscriptionId: stripeSubscription.id,
        status: stripeSubscription.status,
    });
    subscription.save(err => {
        if (err) return res.status(500).send(err);
        res.redirect('/subscriptions');
    });
});

router.delete('/:id', async(req, res) => {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).send('Subscription not found.');

    // Cancel the subscription in Stripe
    const stripeSubscription = await stripe.subscriptions.del(subscription.stripeSubscriptionId);

    // Update the subscription status in your database
    subscription.status = stripeSubscription.status;
    subscription.save(err => {
        if (err) return res.status(500).send(err);
        res.redirect('/subscriptions');
    });
});

module.exports = router;