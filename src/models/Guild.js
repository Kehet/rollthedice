const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('guild', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        usageCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        totalRolls: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        lastRoll: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        lastPlayer: {
            type: DataTypes.STRING,
        },
        lastThrow: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        lastBigger: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    });
};
