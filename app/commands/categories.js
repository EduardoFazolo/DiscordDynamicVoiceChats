const Category = require('../models/categories');

module.exports.run = async (client, msg, args) => {

    // User cannot manage channels
    if(!msg.member.hasPermission("MANAGE_CHANNELS")) return;

    Category.find({"guildId":msg.guild.id}, (err, categories) =>{
        if(err) console.log(err);

        let names = categories.map(c => c.categoryName);
        msg.reply(`The categories I can manage are:\n**${names}**
        `);
    });
    

}

module.exports.help = {
    name: "categories",
    content: `
    `
}