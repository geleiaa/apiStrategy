const Joi = require('joi');

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
                }
                
            }
        }
    }

    create(){
        return {
            path: '/beers',
            method: 'POST',
            handler: (request, headers) =>{
                const req = request.payload
                request.log('read')
                return this.db.create(req)
            }
        }
    }
}

module.exports = BeerRoutes;