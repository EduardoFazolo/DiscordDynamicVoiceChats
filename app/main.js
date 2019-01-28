// Discord
const Discord = require('discord.js');
// Custom
const ChannelManager = require(__dirname + '/scripts/channelmanager.js');
//const token = process.env.token;
const token = "NTM1MjU1MTM1ODYyMTI4NjU1.DykRww.rlRG6RIY_TWmIvJ34wgWL-2NhXQ"

// Discord
const client = new Discord.Client();
// Custom
const manager = new ChannelManager();


async function main() {


	client.on('voiceStateUpdate', async (oldMember, newMember) => {

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
		   await manager.createChannelAuto(newUserChannel);
	  
		} 
		else if(newUserChannel === undefined){
			console.log("left");
			await manager.deleteChannelAuto(oldUserChannel).catch(()=> {return;});

		}
		if(oldUserChannel !== undefined && newUserChannel !== undefined ){
			console.log('moved');
			await manager.createChannelAuto(newUserChannel);
			await manager.deleteChannelAuto(oldUserChannel);
		}

	});

	setInterval(()=>{
		for (const guild of client.guilds.values()){
			manager.wipeEmptyChannels(client, guild);
		}
	}, 1000);
	
	client.on('message', msg =>{
        if(msg.member.user.bot)
            return;
        if(msg.channel.name === 'ingame_names'){

            if(msg.content.split(' ').length > 1){
                msg.reply('Wrong format, please type only your name.');
                return;
            }
  
            msg.member.setNickname(msg.content);
        
        }
    })

}
main();

