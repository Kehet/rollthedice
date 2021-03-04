const sequelize = require('./src/models');

async function reset() {
    await sequelize.sync({force: true});
}

reset();
