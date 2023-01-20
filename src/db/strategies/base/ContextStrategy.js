const Crude = require('./interfaceDB');
// base (reutilizavel)
class ContextStrategy extends Crude {
    constructor(strategy){
        super();
        this._database = strategy
    }

    create(item){
        return this._database.create(item)
    }

    read(item){
        return this._database.read(item)
    }

    update(id, item, upsert){
        return this._database.update(id ,item, upsert)
    }

    delete(id){
        return this._database.delete(id)
    }

    taConnectedEin(){
        return this._database.taConnectedEin()
    }

    static connect(){
        return this._database.connect()
    }
}
// base (reutilizavel)
module.exports = ContextStrategy;