const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
client_id:
    "AR5UgqHz-nRDN6zQhkT8EkPmomI7nDil3gjRhsI4Sl8xklboM40wo0dlGCUECSkvjsWWxBoZEEW55ok9",
client_secret:
    "EPpHg6EogYeImv5PVxMkfPu0CZ4kkSo0qsEHJwRxTivhUbUfAK0hD61yKCr3lmZmtJzXh_VzzyCu3cB4",
});

module.exports = paypal;
