const mongoose = require('mongoose');

const orderEventSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    event: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const surgeEventSchema = new mongoose.Schema({
    zone: { type: String, required: true },
    multiplier: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

const cartEventSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    action: { type: String, required: true },
    item: { type: Object, required: true },
    timestamp: { type: Date, default: Date.now },
});

const trafficMetricSchema = new mongoose.Schema({
    zone: { type: String, required: true },
    load: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = {
    OrderEvent: mongoose.model('OrderEvent', orderEventSchema),
    SurgeEvent: mongoose.model('SurgeEvent', surgeEventSchema),
    CartEvent: mongoose.model('CartEvent', cartEventSchema),
    TrafficMetric: mongoose.model('TrafficMetric', trafficMetricSchema),
};