 ### Api Hapi js, crud basico feito com base em [Classes](https://javascript.info/class) do javascript. O Pattern Strategy entra no storage com multi-database usando Postgres e MongoDB (SQL e NoSql) e também usando dois tipos de ORMs o Mongoose e Sequelize

### Documentação da api com Swagger (hapi-swagger)
* repo das aulas do projeto: https://github.com/nodejsbrazil/cursonodebr01

* ##### Para acessar o doc:
1. ``` npm start ```
2. espere o server "startar"
3. depois acesse http://localhost:4000/documentation no navegador



* ##### Para subir os containers: 
1. ``` docker-compose up -d ```

2. ver os logs dos containers depois de subir ``` docker-compose logs ```

3. Quando terminar de testar é só matar os containers com ``` docker-compose down ```


*NOTE: 1- problemas com as envs... as envs não são visiveis dentro dos testes, só fuciona se passar as configs no próprio arquivo de teste. 2- Verificar o authTest, talvez o usuário de teste não está sendo cadastrado corretamente no banco PG.
