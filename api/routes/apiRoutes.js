class BeerRoutes {
    constructor(db){
        this.db = db
    }

    list(){
        return {
            path: '/beers',
            method: 'GET',
            handler: (request, headers) =>{
                try{
                    const { nome, skip, limit } = request.query

                    let query = {}

                    if(nome) query.nome = nome

                    if(isNaN(skip)) throw Error('Tipo do skip incorreto')

                    if(isNaN(limit)) throw Error('Tipo do limit incorreto')

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