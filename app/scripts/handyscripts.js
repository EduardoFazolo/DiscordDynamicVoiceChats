const Discord = require('discord.js');

module.exports.categoryInGuild =  (id, guild) =>{
    if(guild.channels.get(id) instanceof Discord.Channel && guild.channels.get(id).type === 'category'){
        return true;
    }
    return false;
}