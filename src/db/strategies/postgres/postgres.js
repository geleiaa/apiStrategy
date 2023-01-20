const Crude = require('./../base/interfaceDB');
const Sequelize = require('sequelize');

// class PostgresConnection {
//     static _connect()
// }

class Postgres extends Crude {
    constructor(connection, schema){
        super()
        this._schema = schema
        this._connection = connection
    }

    static connect() {
        const connection = new Sequelize(process.env.POSTGRES_URL, {
            //case sensitive
            quoteIdentifiers: false,
                // deprecation warning
            operatorsAliases: false,
            logging:false,
            ssl: process.env.SSL_DB,
            dialectOptions: {
                ssl: process.env.SSL_DB
            }
        });

        return connection
    }

    async taConnectedEin(){
        try {
            await this._connection.authenticate();
            console.log('Connection Postgres successfull.');
            return true;
        } catch (error) {
            console.error('Deu ruim ao conectar:', error);
            return false;
        }  
    }

    static async defineModel(connection, schema) {
        const model = connection.define(
            schema.name, schema.schema, schema.options
        )
        await model.sync();
        return model
    }

    async create(item){
        const {dataValues} = await this._schema.create(item)
        return dataValues
    }

    async read(item = {}){
        return this._schema.findAll({where: item, raw: true })
    }

    async update(id, item, upsert = false){
        const up = upsert ? 'upsert' : 'update'
        return this._schema[up](item, { where: {id: id} })
    }

    async delete(id) {
        const query = id ? { id } : {};
        return this._schema.destroy({ where: query });
    }
}



module.exports = Postgres;