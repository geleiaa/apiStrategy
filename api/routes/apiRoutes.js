const Joi = require('joi');
const Boom = require('@hapi/boom');

class BeerRoutes {
    constructor(db){
        this.db = db
    }

    list(){
        return {
            path: '/beers',
            method: 'GET',
            config: {
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro;
                    },
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(6),
                        nome: Joi.string().min(3).max(25)
                    }
                }
            },
            handler: (request, headers) =>{
                try{
                    const { nome, skip, limit } = request.query

                    let query = nome ? { nome: {$regex: `.*${nome}*.` } } : {}

                    return this.db.read(query , skip, limit)

                }catch(err){
                    console.log(err);
                    return Boom.internal()
                }
                
            }
        }
    }

    create(){
        return {
            path: '/beers',
            method: 'POST',
            config: {
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro;
                    },
                    payload: {
                        nome: Joi.string().required().min(3).max(35),
                        preco: Joi.number().integer().default(199)
                    }        
                }
            },
            handler: async (request, headers) =>{
                try{

                    const req = request.payload
                    const result = await this.db.create(req)

                    return { message: 'Beer cadastrada successful!!', id: result._id }

                }catch(err){
                    console.log('Deu Ruim', err);
                    return Boom.internal()
                }
            }
        }
    }

    update(){
        return {
            path: '/beers/{id}',
            method: 'PATCH',
            config:{
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro;
                    },
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(35),
                        preco: Joi.string().min(2).max(10)
                    }
                }
            },
            handler: async (request, headers) =>{
                try{
                    const { id } = request.params;
                    const { payload } = request;

                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)

                    const result = await this.db.update(id, dados)

                    if(result.modifiedCount !== 1) return Boom.preconditionFailed('Item nao encontrado')

                    return { message: 'Beer atualizada!!!'}

                }catch(err){
                    console.log('Deu Ruim',err);
                    return Boom.internal()
                }
            }
        }
    }

    delete(){
        return {
            path: '/beers/{id}',
            method: 'DELETE',
            config: {
                validate: {
                    failAction: (request, headers, erro) => {
                        throw erro;
                    },
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                try{

                    const { id } = request.params;
                    const result = await this.db.delete(id)

                    if(result.deletedCount !== 1) return Boom.preconditionFailed('Item nao encontrado')

                    return { message: 'Item removido com sucesso!'}

                }catch(err){
                    console.log(err);
                    return Boom.internal()
                } 

            }
        }
    }
}

module.exports = BeerRoutes;