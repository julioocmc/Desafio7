const fetch = require('node-fetch')

const postProducto = async (data) => {  
    try {
        const response = await fetch('http://localhost:8080/api/productos', {
            method: 'POST', 
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json'},
        })
        const result = await response.json()
        console.log("Respuesta del await: ",result)
        return result
    } catch (error) {
        let err = new Error("Error en la promesa: ",error)
        console.log(err)
        return err
    }           
}

module.exports = postProducto