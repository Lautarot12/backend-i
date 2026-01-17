import fs from 'fs'


class ProductManager {
    constructor(path) {
        this.path = path
    }

    async addProduct (title, description, price, thumbnail, code, stock){

        const existe = fs.existsSync(this.path)

        if(!existe) {
            const emptyData = { payload: [] }
            await fs.promises.writeFile(this.path, JSON.stringify(emptyData))
        }

        const resultado = await fs.promises.readFile(this.path, 'utf-8')
        const data = JSON.parse(resultado)

        const newProduct = {
            id: data.payload.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        data.payload.push(newProduct)

        await fs.promises.writeFile(this.path, JSON.stringify(data))
        return data
    }

    async getProducts () {
        const existe = fs.existsSync(this.path)
        
        if(!existe){
            const emptyData = { payload: [] }
            await fs.promises.writeFile(this.path, JSON.stringify(emptyData))
        }

        const gottenProds = await fs.promises.readFile(this.path, 'utf-8')
        const parsedProds = JSON.parse(gottenProds)
        return parsedProds.payload
    }

    async getProductById (id) {
        const existe = fs.existsSync(this.path)

        if (!existe) {
            console.error('El producto no pudo ser encontrado. Intente nuevamente con otro producto.')
            return null
        }
        const resultado = await fs.promises.readFile(this.path, 'utf-8')
        const data = JSON.parse(resultado)

        const encontradoId = data.payload.find ((prod)=>{
            const coincide = prod.id === Number(id)
            return coincide
        })
        if (!encontradoId) {
            console.log('El producto no pudo ser encontrado. Intente nuevamente con otro producto.')
            return null
        }
        return encontradoId
    }
}

const manager1 = new ProductManager('./products.json')

/* manager1.addProduct('pollofresco', 'pollofresconoelma', '55000', './rutadeimagen', '5570', '300').then((res)=>{
console.log(res.payload)
}).catch((e)=>{
console.error(e)
}) */

/* manager1.getProducts().then((res)=>{
    console.log(res)
}).catch((e)=>{
    console.error(e)
}) */


/* manager1.getProductById(3).then((res)=>{
    console.log(res)
}).catch((e)=>{
    console.error(e)
})
 */
export default ProductManager