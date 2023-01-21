const Joi = require('joi');
const Boom = require('@hapi/boom');
const Jwt = require('jsonwebtoken');

const Password = require('./../../src/helpers/passwordHelper');

// const USER = {
//     username: 'TestUser',
//     password:  'pass1234'
// }

class AuthRoutes {
    constructor(key, db) {
        //super()
        this.secret = key
        this.db = db
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'fazer login',
                notes: 'retorna um token',
                auth: false,
                validate: {
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },

            handler: async (request, headers) =>{
                const { username, password } = request.payload
                console.log(request.payload);
                const [user] = await this.db.read({
                    username: username.toLowerCase()
                })

                console.log('user da rota', [user]);

                if(!user) return Boom.unauthorized('Usuário não existe')

                const validUser = await Password.comparePass(password, user.password)

                if(!validUser) return Boom.unauthorized('Usuário ou Senha invalido')

                return {
                    token: Jwt.sign({
                        username: username
                    }, this.secret)
                }
            }
        }
    }
}

module.exports = AuthRoutes;