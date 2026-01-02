const REDIS_KEYS = {
    CART: (userId) => `cart:${userId}`,
    SURGE: (zone) => `surge:${zone}`,
    ACTIVE_ORDERS: (zone) => `active_orders:${zone}`,
    AVAILABLE_PARTNERS: (zone) => `available_partners:${zone}`,
};

module.exports = REDIS_KEYS;