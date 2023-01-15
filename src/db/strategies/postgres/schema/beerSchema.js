const Sequelize = require('sequelize');

const beerSchema = {
    name: 'beers',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true,
        },  
        nome: {
            type: Sequelize.STRING,
            required: true,
        },
        preco: {
            type: Sequelize.STRING,
            required: true,
        }
    },
    
    options: {
        //opcoes para base existente
        tableName: 'TB_BEERS',
        freezeTableName: false,
        timestamps: false,
    }
}

module.exports = beerSchema;