const mongoose = require('mongoose');
const Category = require('../models/categories');
const Discord = require('discord.js');
const handyscripts = require('../scripts/handyscripts');

module.exports.run = async (client, msg, args) => {

    // User cannot manage channels
    if(!msg.member.hasPermission("MANAGE_CHANNELS")) return;
    if(args.length < 1){
        msg.reply("Please, add the category ids!");
        return;
    }
    // Connect to db
    mongoose.connect('mongodb://localhost/GuildCategories', {useNewUrlParser: true});

    
    // Trim the spaces in the message
    let categs = msg.content.slice(5).trimLeft().trimRight().toLocaleLowerCase();
    // Split with every space
    let categsArr = [...categs.split(/\s+/g)];
    // Add each category to the data
    categsArr.forEach(c => {
        console.log(c)
        if(c.length !== 18 || !handyscripts.categoryInGuild(c, msg.guild)){
            msg.reply(c + ' Is not a category from this server.');
            return;
        }

        Category.deleteOne({"_id":c})
        .then(result => {

            console.log(result);
            if(result.deletedCount === 0)
                msg.reply("Category could not be deleted. This could be because this category is not registered.")
            else
                msg.reply(`Category **${msg.guild.channels.get(c).name}** deleted from my manageable list.`);
        })
        .catch(err => {console.log(err)})

    });

}

module.exports.help = {
    name: "del",
    content:`
    **Use \`-del\` to delete categories**
    It works *exactly the same way* as the \`-add\` command, but will just delete the categories from my manageable list instead.
    `
}