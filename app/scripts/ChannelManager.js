const svcfg = require('../config/svconfig.json');
const categories = svcfg.categories;
const Category = require('../models/categories');



module.exports = class ChannelManager {

    constructor(){
        this.deletedChannels = [];
    }

    async createChannelAuto(channel){

        Category.find({"_id":channel.parent.id, "guildId":channel.guild.id}, err =>{
            if(err) console.log(err);
        })
        .then( res => {
            {
                if(res && res.length > 0){
                    this.createChannel(channel);
                }
            }
        })
    }

    async createChannel(channel){

        const categoryCfg  = categories.find(e => e.name.toLowerCase() == channel.parent.name.toLowerCase());

        if(categoryCfg === undefined) { console.log("Category " + channel.parent.name + " not found in the svconfig.json file."); return }

        if(categoryCfg.limited && (categoryCfg.channels === undefined || categoryCfg.channels.length === 0)){
            return;
        }
        let categoryName = 'undefined';

        if(categoryCfg.hasDefinedNames === true){
            categoryName = categoryCfg.channels.find(name => !channel.parent.children.map(ch => ch.name).includes(name));
        }
        else{
            categoryName = categoryCfg.channelName + ' ' + (channel.parent.children.size + 1);
            categoryName = this.findSuitebleName(channel.parent, categoryName);
        }
        
        if(channel.members.size - 1 === 0
            && this.canUseName(channel.parent, categoryName) 
            && !this.canDeleteFromCategory(channel.parent))
        {
            channel.guild.createChannel( categoryName, {type:'voice',parent:channel.parent.id}).then(async ch=>{
                await ch.setUserLimit(categoryCfg.userLimit);
            })
        }
        
    }

    canUseName(category, name){
        
        if(!category.children.map(ch => ch.name).includes(name)){
            return true;
        }

        return false;
    }

    findSuitebleName(category, name){
        let counter = [];
        if(!this.canUseName(category, name)){
            if(typeof(arguments[1]) === "string")
                counter = category.children.map(ch => parseInt(ch.name.split(' ')[1]));
            for (let i in counter){
                if(!counter.includes(parseInt(i)+1)){
                    return name.split(' ')[0] + ' ' + (parseInt(i)+1);
                }

            }

        }
        return name;
    }

    canDeleteFromCategory(category){
        // If this category have at least one more empty channel
        if(category.children.filter(child => child.members.size === 0).size > 1)  {
            return true;
        }
        return false;
    }

    async wipeEmptyChannels(guild){

        Category.find({"guildId":guild.id},async (err, res) =>{
            if(err) {console.log(err); return};
            if(!res) return;
            res.forEach(categ =>{
                let deletables = guild.channels.get(categ._id).children.filter(ch => ch.members.size < 1).array().slice(1);
                if(deletables.length > 0){
                    deletables.forEach(ch => {if (ch.members.size < 1) ch.delete()});
                    console.log(guild.channels.get(categ._id).name);
                }
            });

        })
    }

}