// Custom
const ChannelManager = require(__dirname + '/ChannelManager.js');
const channelmanager = new ChannelManager();
const WIPE_DELAY = require('../config/botconfig.json').WIPE_DELAY;


module.exports.manageCategories = async (oldMember, newMember) => {


	// Ignore updates that aren't any of connection/disconnection/move
	if(oldMember.voiceChannelID === newMember.voiceChannelID){
		return;
	}
	// Ignore updates that happened in another guild
	if(oldMember.guild.id !== newMember.guild.id){
		return;
	}
	
	let newUserChannel = newMember.voiceChannel
	let oldUserChannel = oldMember.voiceChannel
	
	if(oldUserChannel === undefined && newUserChannel !== undefined) {
		console.log("joined");
		await channelmanager.createChannelAuto(newUserChannel);

	} 
	else if(newUserChannel === undefined){
		console.log("left");

	}
	if(oldUserChannel !== undefined && newUserChannel !== undefined ){
		console.log('moved');
		await channelmanager.createChannelAuto(newUserChannel);
	}

	

}

module.exports.wipeVoiceChannels = async (client) => {

	setInterval(async ()=>{

		for (const guild of client.guilds.values()){
			await channelmanager.wipeEmptyChannels(guild);
		}
	}, WIPE_DELAY);

}
