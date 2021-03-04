const {models} = require('./models');

module.exports = class RollTheDice {

    async roll(message) {
        const guild = await this._findOrCreateGuild(message);

        if (guild.lastPlayer === message.author.id) {
            message.reply("You cant dice twice in row!");
            return;
        }

        const guildTimeLeft = Math.floor((Date.now() - guild.lastThrow) / 1000);
        if (guildTimeLeft < 60) {
            message.channel.send("Dice can be thrown only once per ~minute!");
            return;
        }

        const roll = Math.floor(Math.random() * 6) + 1;

        const player = await this._findOrCreatePlayer(message, guild);

        const playerTimeLeft = Math.floor((Date.now() - player.lastThrow) / 1000);
        if (playerTimeLeft < 300) {
            message.channel.send(`You can only dice every 5 minutes! **${300 - playerTimeLeft}** secs left.`);
            return;
        }

        this._handleRoll(guild, roll, player, message);
        this._updateGuild(guild, roll, player);
        await this._updateTopic(guild, message);
    }

    _handleRoll(guild, roll, player, message) {
        if (guild.lastRoll < roll) {
            player.totalPoints += 1 + guild.lastBigger;
            player.totalWins += 1;

            message.channel.send(
                `${player.name} rolled **${roll}**, it was bigger than the last one so he **got ${guild.lastBigger + 1} point!** ` +
                `He has now total **${player.totalPoints}** points!`
            );
        } else if (guild.lastRoll > roll) {
            player.totalLosses += 1;
            player.totalPoints -= 1;
            guild.lastBigger = 0;

            message.channel.send(
                `${player.name} rolled **${roll}**, it was smaller than the last one so he **lost 1 point!** ` +
                `He has now total **${player.totalPoints}** points!`
            )
        } else {
            player.totalPoints += 3;
            player.totalDraws += 1;
            guild.lastBigger = 0;

            message.channel.send(
                `${player.name} rolled **${roll}**, it was same as the last one so he **got 3 points!** ` +
                `He has now total **${player.totalPoints}** points!`
            );
        }

        player.lastThrow = Date.now();
        player.save();
    }

    _updateGuild(guild, roll, player) {
        guild.totalRolls += 1;
        guild.lastRoll = roll;
        guild.lastPlayer = player.id;
        guild.lastThrow = Date.now();

        if (guild.lastBigger === 4) {
            guild.lastBigger = 9;
        } else if (guild.lastBigger === 3) {
            guild.lastBigger = 4;
        } else if (guild.lastBigger === 2) {
            guild.lastBigger = 3;
        } else if (guild.lastBigger === 1) {
            guild.lastBigger = 2;
        } else if (guild.lastRoll < roll) {
            guild.lastBigger = 1;
        } else {
            guild.lastBigger = 0;
        }

        guild.save();
    }

    async _updateTopic(guild, message) {

        if(guild.totalRolls % 10 !== 0) {
            return;
        }

        const players = await models.player.findAll({
            where: {
                guildId: guild.id,
            },
            order: [
                ['totalPoints', 'DESC']
            ],
            limit: 10,
        });

        const scoreList = players.map((player, index) => {
            return `${index + 1}.) ${player.name} (${player.totalPoints})`
        }).join("\n")

        const topic = `:chart_with_upwards_trend: Dice has been rolled total ${guild.totalRolls} times! Top 10 rollers:\n${scoreList}`

        message.channel.send(topic)
    }

    async points(message, args) {
        const guild = await this._findOrCreateGuild(message);

        if(args.length === 0) {
            const player = await this._findOrCreatePlayer(message, guild);

            const playerTimeLeft = Math.floor((Date.now() - player.lastThrow) / 1000);

            message.channel.send(
                `Your points: **${player.totalPoints}**  `+
                `Wins: **${player.totalWins}**  `+
                `Draws: **${player.totalDraws}**  `+
                `Losses: **${player.totalLosses}**  `+
                `Time to roll again: **${300 - playerTimeLeft} secs**`
            );
        }
    }

    async _findOrCreateGuild(message) {
        const [guild, created] = await models.guild.findOrCreate({
            where: {
                id: message.channel.guild.id,
            },
            defaults: {
                id: message.channel.guild.id,
                name: message.channel.guild.name,
                totalRolls: 0,
                lastRoll: 3,
                lastPlayer: null,
                lastThrow: 1,
                lastBigger: 0,
            }
        });
        return guild;
    }

    async _findOrCreatePlayer(message, guild) {
        const [player, created] = await models.player.findOrCreate({
            where: {
                id: message.author.id,
                guildId: guild.id,
            },
            defaults: {
                id: message.author.id,
                guildId: guild.id,
                name: message.author.username,
                totalPoints: 0,
                totalWins: 0,
                totalDraws: 0,
                totalLosses: 0,
                lastThrow: 0,
            }
        });
        return player;
    }
}
