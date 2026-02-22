import fs from 'fs'

class ProductManager {
    constructor(path) {
        this.path = path
    }

    async updateProduct (id, updatedFields) {
        const allProds = await this.getData()
        const product = allProds.find(prod=>prod.id === Number(id))
        if (!product) {
            return null
            } delete updatedFields.id
            Object.assign(product, updatedFields)
            await this.saveData(allProds)
            return product
        }

        async deleteProduct (id) {
            const allProds = await this.getData()
            const deletedProduct = allProds.find(prod=>prod.id === Number(id))
            if (!deletedProduct) {
                return null
            }
            const filteredProds = allProds.filter((prod)=>{
                return prod.id !== id
            })
            if (filteredProds.length === allProds.length) {
                return null
            }
            await this.saveData(filteredProds)
            return deletedProduct
        }


    async getData () {
        const existe = fs.existsSync(this.path)
        if(!existe) {
            const emptyData = []
            await fs.promises.writeFile(this.path, JSON.stringify(emptyData))
        }

        const resultado = await fs.promises.readFile(this.path, 'utf-8')
        const data = JSON.parse(resultado)
        return data
    }

    async saveData (data) {
        const stringedData = JSON.stringify(data)
        await fs.promises.writeFile(this.path, stringedData)
    }


    async addProduct (title, description, price, thumbnail, code, stock){

        const data = await this.getData()

        const newProduct = {
            id: data.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        data.push(newProduct)

        await this.saveData(data)
        return data
    }

    async getProducts () {
        const data = await this.getData()
        return data
    }

    async getProductById (id) {
        const data = await this.getData()

        const encontradoId = data.find ((prod)=>{
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

export default ProductManager