const request = require('request');

const request_codes = () => new Promise((resolve, reject) => request({url: 'https://nukacrypt.com/solved'}, (err, resp, body) => {
    if(err) return reject(err);
    resolve(body.match(/<\s*td[^>]*>(\d{8})<\s*\/td>/g).map(code => code.match(/\d+/)[0]));
}));

module.exports.run = async (client, message, args) => {
    if(message.channel.name.toLowerCase() !== 'nuke_advertisements') return;
    let codes = await request_codes();
    let silos = ['Alpha', 'Beta', 'Charlie'];
    codes = codes.map( (code,i) => "**Silo " + silos[i] + ":** " + code + "\n");
    let silo_codes = {
        a:codes[0],
        b:codes[1],
        c:codes[2]
    }
    message.reply("The codes are:\n" + silo_codes.a + silo_codes.b + silo_codes.c);
}

module.exports.help = {
    name: "codes",
    content:"you know how it works.."
}