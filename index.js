const express = require("express")
const { Server: HTTPServer} = require('http')
const { Server: IOServer } = require("socket.io")
const { engine } = require('express-handlebars')
const { router, tablaProductos } = require('./routes/routes') 

const postProducto = require('./public/js/postProducto')
const { ClienteDB } = require('./public/js/clienteDB')

const tablaChat = new ClienteDB({
    client: 'sqlite3',
    connection: {
        filename: "./DB/ecommerce.sqlite"
    },
    useNullAsDefault: true
},"sqliteDB")

let getProductosDB = []
let getChatsDB = []

tablaChat.crearTablaSQLite().then(()=>{
    console.log("***")
}).catch(err => console.log(err))

const app = express()
const http = new HTTPServer(app)
const io = new IOServer(http)

app.engine('handlebars',engine())
app.set('view engine','handlebars')
app.set('views','./views')

app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(express.static("public"))

app.use('/api/productos', router)

app.get('/', (req, res) => {  
    sendFuctionProd(() => {
        res.render('formulario',{listExist: getProductosDB})
    })
})

const PORT = 8080
const serverPort = http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
serverPort.on('error', error => console.log(`Error en el puerto del servidor: ${error}`))

io.on("connection", async(socket) => {
    console.log("Nuevo cliente conectado")
    socket.emit('allProductos', getProductosDB)
    
    sendFuctionChat(() => {
        socket.emit('allMensajes', getChatsDB)
    })

    socket.on('newProducto', async data => {
        console.log("Nuevo producto agregado: ", data)
        await postProducto(data)       
        sendFuctionProd(() => {
            io.sockets.emit('allProductos', getProductosDB)
        }) 
    })

    socket.on('newMensaje', async msg => {
        console.log("Nuevo mensaje agregado: ", msg)
        tablaChat.postDB(
            {
                mail: msg.mail, 
                mensaje: msg.mensaje, 
                fecha: msg.fecha
            }
        ).then(() => { console.log("Chat insertado") }).catch(err => console.log(err))

        sendFuctionChat(() => {
            io.sockets.emit('allMensajes', getChatsDB)
        })
    })
})

function sendFuctionProd(function_parameter){
    getProductosDB = []
    tablaProductos.getDB().then((rows)=>{
        for(let row of rows){
            getProductosDB.push(
                {
                    id:`${row['ID']}`,
                    title: `${row['Title']}`,
                    price: `${row['Price']}`,
                    thumbnail: `${row['Thumbnail']}`
                }
            )
        }
        function_parameter()
    }).catch(err => console.log(err))    
}

function sendFuctionChat(function_parameter){
    getChatsDB = []
    tablaChat.getDB().then((rows)=>{
        for(let row of rows){
            getChatsDB.push(
                {
                    mail:`${row['mail']}`,
                    mensaje: `${row['mensaje']}`,
                    fecha: `${row['fecha']}`,
                    id: `${row['id']}`
                }
            )
        }
        function_parameter()
    }).catch(err => console.log(err)) 
}