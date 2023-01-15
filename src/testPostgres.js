const assert = require('assert');
const Postgres = require('./db/strategies/postgres/postgres');
const beerSchema = require('./db/strategies/postgres/schema/beerSchema');
const Context = require('./db/strategies/base/ContextStrategy');


const BIER_OBJETO = { nome: 'Skol', preco: '2.99' }

//const BOBJETO_UPDATE = { nome: 'Itaip', preco: '1.99' }
let context = {}

describe('Postgres Teste', () => {
    //this.timeout(Infinity)
    before( async () =>{
        const connection = await Postgres.connect() 
        const model = await Postgres.defineModel(connection, beerSchema) 
        context = new Context(new Postgres(connection, model))  //instancia o crud com a strategy

        await context.delete();
        //await context.create(BIER_OBJETO);
        //await context.create(BOBJETO_UPDATE);
    })

    it('Connection com o DB', async () => {
        const result = await context.taConnectedEin()
        assert.equal(result, true)
    })

    it('Create no DB', async () =>{
        const result = await context.create(BIER_OBJETO)
        delete result.id
        assert.deepEqual(result, BIER_OBJETO)
    })

    it('Read no DB', async () =>{
        const [result] = await context.read({ nome: BIER_OBJETO.nome })
        // [posição1, posição2]
        delete result.id
        assert.deepEqual(result, BIER_OBJETO)
    })

    it('Update no DB', async () =>{
        const [itemAtualizar] = await context.read({})
        const newItem = { ...BIER_OBJETO, nome: 'Imperio' } // spread

        const [result] = await context.update(itemAtualizar.id, newItem)
        //const [itemModified] = await context.read({ id: itemAtualizar.id })

        assert.deepEqual(result, 1)
        //assert.deepEqual(itemModified.nome, newItem.nome)
    })

    it('Delete no DB', async () =>{
        const [item] = await context.read({})
        const result = await context.delete(item.id)

        assert.deepEqual(result, 1)
    })
})
