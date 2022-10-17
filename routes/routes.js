const { Router } = require('express')
const router = Router()

const { ClienteDB } = require('../DesafioDB/public/js/clienteDB')
const tablaProductos = new ClienteDB({
    client: 'mysql',
    connection: {
        host : 'localhost',
        port : 3306,
        user : 'root',
        password : '',
        database : 'mariaDB'
    }
},"mariaDB")

tablaProductos.crearTablaMariaDB().then(()=>{
    console.log("...")
}).catch(err => console.log(err))

router.get('/', (req, res) => {  
    let x_productos = []

    tablaProductos.getDB().then((rows)=>{
        for(let row of rows){
            x_productos.push(
                {
                    id:`${row['ID']}`,
                    title: `${row['Title']}`,
                    price: `${row['Price']}`,
                    thumbnail: `${row['Thumbnail']}`
                }
            )
        }
        console.log(x_productos)

        if(x_productos.length === 0){
            res.send({ "error" : "No existen productos" })    
        }else{
            res.send(x_productos)    
        }

    }).catch(err => console.log(err))       
})

router.get('/:id', (req, res) => { 
    let iD = parseInt(req.params.id)
    let objNew = {}

    tablaProductos.getDbById(iD).then((rows)=>{
        for(let row of rows){
            objNew = {
                id: `${row['ID']}`,
                title: `${row['Title']}`, 
                price: `${row['Price']}`, 
                thumbnail: `${row['Thumbnail']}`                
            }
        }

        if(Object.keys(objNew).length === 0){
            res.status(400).json({ error : "Producto no encontrado" });    
        }else{
            res.send(objNew)    
        }
    }).catch(err => console.log(err))   
})

router.post('/', (req, res) => { 
    const { title, price, thumbnail } = req.body
    let newId = []

    if(!title || !price || !thumbnail){
        res.status(400).json({ "error": "Ingrese todos los datos del producto" })
        return 0
    }

    tablaProductos.postDB(
        {
            Title: title, 
            Price: price, 
            Thumbnail: thumbnail
        }
    ).then(() => {
        console.log("Data insertada")
        tablaProductos.getDB().then((rows)=>{
            for(let row of rows){
                newId.push(`${row['ID']}`)
            }
            res.send({id: newId[newId.length -1], title, price, thumbnail})
        }).catch(err => console.log(err))   
    }).catch(err => console.log(err))    
})

router.put('/:id', (req, res) => {    
    let iD = parseInt(req.params.id)
    const { title, price, thumbnail } = req.body
    let objNew = {}

    if(!title || !price || !thumbnail){
        res.status(400).json({ "error": "Ingrese todos los datos del producto" })
        return 0
    }else{
        tablaProductos.getDbById(iD).then((rows)=>{
            for(let row of rows){
                objNew = {
                    id: `${row['ID']}`,
                    title: `${row['Title']}`, 
                    price: `${row['Price']}`, 
                    thumbnail: `${row['Thumbnail']}`                
                }
            }

            if(Object.keys(objNew).length === 0){
                res.status(400).json({ error : "Producto no encontrado" });    
            }else{
                tablaProductos.putMariaDbById(iD, { ID: objNew.id, Title: title, Price: price, Thumbnail: thumbnail }).then(()=>{
                    res.send({Mensaje: 'Producto Actualizado exitosamente'})
                    console.log(`Producto actualizado`,{ ID: objNew.id, Title: title, Price: price, Thumbnail: thumbnail })
                }).catch(err => console.log(err))                    
            }
        }).catch(err => console.log(err))
    }
})

router.delete('/:id', (req, res) => { 
    let iD = parseInt(req.params.id)
    let objNew = {}

    tablaProductos.getDbById(iD).then((rows)=>{
        for(let row of rows){
            objNew = {
                id: `${row['ID']}`,
                title: `${row['Title']}`, 
                price: `${row['Price']}`, 
                thumbnail: `${row['Thumbnail']}`                
            }
        }

        if(Object.keys(objNew).length === 0){
            res.status(400).json({ error : "Producto no encontrado" });    
        }else{
            tablaProductos.deleteDbById(iD).then(()=>{
                res.send({Mensaje: 'Producto Eliminado exitosamente'})
                console.log(`Producto eliminado`)
            }).catch(err => console.log(err))   
        }
    }).catch(err => console.log(err))   
})

module.exports = {
    router: router,
    tablaProductos: tablaProductos
}