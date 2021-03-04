const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logQueryParameters: false,
    benchmark: false
});

const modelDefiners = [
    require('./Guild'),
    require('./Player'),
];

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

sequelize.models.guild.hasMany(sequelize.models.player);
sequelize.models.player.belongsTo(sequelize.models.guild);

module.exports = sequelize;
