// Interface crud
class NotImplmentedExcpt extends Error {
    constructor() {
        super("Nao implementado exception")
    }
}

class Crude {
    create(item){
        throw new NotImplmentedExcpt()
    }

    read(query){
        throw new NotImplmentedExcpt()
    }

    update(id, item, upsert){
        throw new NotImplmentedExcpt()
    }

    delete(id){
        throw new NotImplmentedExcpt()
    }

    taConnectedEin(){
        throw new NotImplmentedExcpt()   
    }

    connect(){
        throw new NotImplmentedExcpt()
    }
}
// Interface crud

module.exports = Crude;