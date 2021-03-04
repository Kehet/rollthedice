'use strict';

const sequelize = require('./src/models');

const Discord = require('discord.js');
const client = new Discord.Client();

const RollTheDice = require('./src/RollTheDice');
const game = new RollTheDice();

const {prefix, token} = require('./config.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'dm') return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    console.debug(`command ${command} in ${message.guild.name}`);

    switch (command) {
        case 'roll':
            game.roll(message);
            break;
        case 'points':
            game.points(message, args);
            break;
    }

});

client.login(token);
