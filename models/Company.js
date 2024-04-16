const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const companySchema = new mongoose.Schema({
    name: String,
    registerDate: { type: Date },
    closeDate: { type: Date },
    inn: String,
    ogrn: String
});

companySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Company', companySchema);
