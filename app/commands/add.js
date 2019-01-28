const Category = require('../models/categories');
const handyscripts = require('../scripts/handyscripts');
module.exports.run = async (client, msg, args) => {

    // User cannot manage channels
    if(!msg.member.hasPermission("MANAGE_CHANNELS")) return;
    if(args.length < 1){
        msg.reply("Please, add the category ids!");
        return;
    }

    // Trim the spaces in the message
    let categs = msg.content.slice(5).trimLeft().trimRight().toLocaleLowerCase();
    // Split with every space
    let categsArr = [...categs.split(/\s+/g)];
    // An array of categories
    let newCategory = [];
    // Add each category to the data
    categsArr.forEach(c => {
        console.log(c)
        if(c.length !== 18 || !handyscripts.categoryInGuild(c, msg.guild)){
            msg.reply(c + ' Is not a category from this server.');
            return;
        }

        newCategory.push(new Category({
            _id: c,
            categoryName: msg.guild.channels.get(c).name,
            guildId: msg.guild.id,
            guildName: msg.guild.name

        }));

        newCategory.forEach(nc=> nc.save()
            .then(result => {console.log(result); msg.reply(`Category **${msg.guild.channels.get(c).name}** added to my manageable list.`);})
            .catch(err => {console.log(err); msg.reply("Category could not be added.This could be because this category is already registered.")})
        );

    });


}

module.exports.help = {
    name: "add",
    content:`
    **Use \`-add\` to  add a new category.**
			*But remember it has to be the category id, or else I won't be able to find it.*
			Example:
			-add 529433609872787981
			And you can add more than one *(separating with space)* as well:
			-add 529433609872787981 829133609872787981 872785294798133609
    `
}
