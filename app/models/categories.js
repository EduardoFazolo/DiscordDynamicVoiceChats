const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: String,
    categoryName: String,
    guildId: String,
    guildName: String
    
});

module.exports = mongoose.model("GuildCategories", categorySchema);