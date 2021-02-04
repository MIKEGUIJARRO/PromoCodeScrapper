const { model, Schema } = require('mongoose');

const Item = new Schema({
    category: String,
    sellerName: String,
    link: String,
    code: String,
    startDate: Date,
    endDate: Date,
});

module.exports = model("Item",)