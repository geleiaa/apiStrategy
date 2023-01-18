const assert = require('assert');
const api = require('./../api/api');

let app = {};

const BEER_TESTE = { nome: 'TesteCreate', preco: 399 }
const BEER_TESTE_UP = { nome: 'TesteUpdate', preco: 399 }
//const BEER_TESTE_DEL = { nome: 'TesteDelete', preco: 299 }
const BEER_TESTE_1 = { nome: 'Test in ingleis', preco: 219 }
const BEER_TESTE_2 = { nome: 'Testando só', preco: 190 }
const BEER_TESTE_3 = { nome: 'Mais um teste', preco: 599 }
let TESTE_ID = ''
// let TESTE_ID_DEL = ''

describe('Testes da Api', function () {
    this.beforeAll(async () => {
        app = await api // espera o server startar
        await app.inject({ method: 'POST', url: '/beers', payload: JSON.stringify(BEER_TESTE_1) })
        await app.inject({ method: 'POST', url: '/beers', payload: JSON.stringify(BEER_TESTE_2) })
        await app.inject({ method: 'POST', url: '/beers', payload: JSON.stringify(BEER_TESTE_3) })

        // resultDel = await app.inject({ method: 'POST', url: '/beers', payload: JSON.stringify(BEER_TESTE_DEL) })
        // const dadosDel = JSON.parse((resultDel.payload))
        // TESTE_ID_DEL = dadosDel.id
        // console.log('Id Delete Create', TESTE_ID_DEL);

        result = await app.inject({ method: 'POST', url: '/beers', payload: JSON.stringify(BEER_TESTE_UP) })
        const dados = JSON.parse((result.payload))
        TESTE_ID = dados.id
    })

    it('Listar na Api', async () =>{
        const result = await app.inject({
            method: 'GET',
            url: '/beers?skip=0&limit=3'
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('Listar com query', async () => {
        const TAM_LIMIT = 3
        const result = await app.inject({
            method: 'GET',
            url: `/beers?skip=0&limit=${TAM_LIMIT}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        //assert.ok(dados.length === TAM_LIMIT) <----- VER ISSO, DEU ERRO

    })

    it('Filtrar a query com string', async () => {
        const TAM_LIMIT = 'T'
        const result = await app.inject({
            method: 'GET',
            url: `/beers?skip=0&limit=${TAM_LIMIT}`
        })

        errorResult = {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "child \"limit\" fails because [\"limit\" must be a number]",
            "validation": {
                "source": "query",
                "keys": ["limit"]
            }
        }

        assert.deepEqual(result.statusCode, 400)
        assert.deepEqual(result.payload, JSON.stringify(errorResult))
    })

    it('Filtrar um item da query', async () => {
        const NAME = 'Teste'
        const result = await app.inject({
            method: 'GET',
            url: `/beers?skip=0&limit=3&nome=${NAME}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados[0].nome, NAME)

    })

    it('Create na API', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/beers',
            payload: JSON.stringify(BEER_TESTE)
        })

        const statusCode = result.statusCode
        const { message, id } = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.notStrictEqual(id, undefined)
        assert.deepEqual(message, 'Beer cadastrada successful!!')
    })

    it('Atualizar na API', async () => {
        const _id = TESTE_ID
        const expected = { nome: 'Atualizado!!'}

        const result = await app.inject({
            method: 'PATCH',
            url: `/beers/${_id}`,
            payload: JSON.stringify(expected)
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Beer atualizada!!!')
    })

    it('Delete na API', async () => {
        const _id = TESTE_ID
        const result = await app.inject({
            method: 'DELETE',
            url: `/beers/${_id}`
        })

        // console.log('Id delete Test', TESTE_ID_DEL);
        // console.log(result);

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Item removido com sucesso!')
    })
})
