const Knex = require("knex");

class ClienteDB{
    constructor(knexConfig, tableName){
        this.db = Knex(knexConfig)
        this.nombreTabla = tableName
    }

    crearTablaMariaDB(){
        let flagState
        return this.db.schema.hasTable(this.nombreTabla).then(function(exists) {
            if (!exists) {
                flagState = true
            }else{
                flagState = false
            }
        }).finally(() => { 
            if(flagState){
                console.log(`Se crea la tabla "${this.nombreTabla}"`)
                return this.db.schema.createTable(this.nombreTabla, table =>{
                    table.increments("ID").primary();
                    table.string("Title",15).notNullable();
                    table.string("Thumbnail",255).notNullable();
                    table.float("Price")
                })                 
            }else{
                console.log(`La tabla "${this.nombreTabla}" ya existe`)    
            }   
        })
    }

    crearTablaSQLite(){
        let flagState
        return this.db.schema.hasTable(this.nombreTabla).then(function(exists) {
            if (!exists) {
                flagState = true
            }else{
                flagState = false
            }
        }).finally(() => { 
            if(flagState){
                console.log(`Se crea la tabla "${this.nombreTabla}"`)
                return this.db.schema.createTable(this.nombreTabla, table =>{
                    table.increments("id").primary();
                    table.string("mail",255).notNullable();
                    table.string("mensaje",255).notNullable();
                    table.string("fecha",25).notNullable();
                })                 
            }else{
                console.log(`La tabla "${this.nombreTabla}" ya existe`)    
            }   
        })
    }    

    getDB(){
        return this.db.from(this.nombreTabla).select("*")
    }

    getDbById(id){
        return this.db.from(this.nombreTabla).select("*").where({ id: `${id}` })
    }

    postDB(data){
        return this.db(this.nombreTabla).insert(data)
    }

    deleteDbById(id){
        return this.db(this.nombreTabla).where({ id: `${id}` }).del()
    }

    putMariaDbById(id, objPut){
        return this.db(this.nombreTabla).where({ id: `${id}` }).update(
            {
                Title: `${objPut.Title}`, 
                Price: `${objPut.Price}`, 
                Thumbnail: `${objPut.Thumbnail}`
            }
        )
    }
}

module.exports = { ClienteDB };