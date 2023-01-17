const Crude = require('./../base/interfaceDB');
const Mongoose = require('mongoose');

Mongoose.set('strictQuery', true);

const STATUS = {
    0: 'Disconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Disconectando',
}

class MongoDB extends Crude {
    constructor(connection, schema){
        super();
        this._schema = schema
        this._connection = connection
    }

    async taConnectedEin() {
        const state = STATUS[this._connection.readyState]
        if (state === 'Conectado') return state;

        if (state !== 'Conectando') return state

        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._connection.readyState]

    }

    static connect() {
        Mongoose.connect('mongodb://127.0.0.1:27017/', err => {
            if (err) console.error(err)
            console.log(
              `Connection State: ${STATUS[connection.readyState]}`
            )
          } 
        );

        const connection = Mongoose.connection;
        //this._connection.on('open', () => console.log('Conection succesfull!!!')) 
        return connection
    }


    create(item) {
        return this._schema.create(item)
    }

    read(item, skip=0, limit=10){
        return this._schema.find(item).skip(skip).limit(limit)
    }

    update(id, item){
        return this._schema.updateOne({ _id: id }, { $set: item })
    }

    delete(id){
        return this._schema.deleteOne({ _id: id})
    }
}


module.exports = MongoDB;