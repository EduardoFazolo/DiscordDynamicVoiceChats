// File system
const fs = require('fs');

// Discord
const Discord = require('discord.js');
const client = new Discord.Client();
// A custom collection for the commands
client.commands = new Discord.Collection();

// Mongodb
const mongoose = require('mongoose');
const mongodbURL = process.env.mongodbURL;
//const mongodbURL = require('./config/botconfig.json').mongodbURL;

// Custom
const manager = require('./scripts/manager');
const prefix = require('./config/botconfig.json').prefix;
const token = process.env.token;
//const token = require('./config/botconfig.json').token;


async function main(){

    if(token == ""){
		throw new Error("Invalid token");
	}

    // Await for the mongoose connection
    await mongoose.connect(mongodbURL + "GuildCategories", {useNewUrlParser: true}).then(()=> console.log("Mongoose connection was successful!")).catch("Not connected");

	client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}!`);
	});

    // Await for bot login
	await client.login(token);
    
    // Read all the command names
    fs.readdir("./app/commands/", (err, files)=>{
        if (err) throw new Error(err);
        
        // Filter by the js files
        let jsfile = files.filter(f => f.split(".").pop() === "js");
        console.log(jsfile)
        if(jsfile.length <= 0){
            console.log("Couldn't find commands.");
            return;
        }

        // Sets all scripts to the client.commands
        jsfile.forEach((f, i) => {
            let props = require(`./commands/${f}`);
            console.log(`${f} loaded!`);
            console.log(i + ' files loaded');
            // Sets a new command with the given name and script
            client.commands.set(props.help.name, props);
        })
    })

    // Files: ./scripts/manager.js && ./scripts/ChannelManager.js
    client.on('voiceStateUpdate', async (oldMember, newMember) => {
        manager.manageCategories(oldMember, newMember);
    });

    // Files: ./scripts/manager.js && ./scripts/ChannelManager.js
    manager.wipeVoiceChannels(client);

    // Message event
    client.on('message', message =>{
        if(message.author.bot) return;
        if(message.channel.type === 'dm') return;

        // Split message by space
        let messageArray = message.content.split(" ");
        // Assume the command is the first half (first part of the message)
        let cmd = messageArray[0];
        // And the action is everything else
        let args = messageArray.slice(1);

        // get the second slice of the first part of the message (the command)
        let commandfile = client.commands.get(cmd.slice(prefix.length));
        if(commandfile) commandfile.run(client, message, args);

    });
    
}

main();