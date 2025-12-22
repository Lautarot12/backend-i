import fs from 'fs'

/**async function manejoDeArchivos(){
    try {
        await fs.promises.writeFile('./testPromesa.txt', 'contenido con promesa')

        const contenido = await fs.promises.readFile('./testPromesa.txt', 'utf-8')
        console.log(contenido)
        await fs.promises.appendFile('./testPromesa.txt', 'contenido agregado con append')

        const contenido2 = await fs.promises.readFile('./testPromesa.txt', 'utf-8')
        console.log(contenido2)
    } catch (e) {
        console.error('Error:',e)
    }
}

manejoDeArchivos()
*/

class UsersManager {
    static #path = './usuarios.json'
    static async CrearUsuarios(nombre, apellido, edad, curso){
        const existe = fs.existsSync(this.#path) 

        if(!existe){
            await fs.promises.writeFile(this.#path, JSON.stringify({ payload: [] }))
        }

        const resultado = await fs.promises.readFile(this.#path, 'utf-8')
        const data = JSON.parse(resultado)
        // { payload: [] }

        const nuevoUsuario = {
            nombre,
            apellido,
            edad,
            curso
        }

        data.payload.push(nuevoUsuario)
        await fs.promises.writeFile(this.#path, JSON.stringify(data))
    }

    static async ConsultarUsuarios(){
        const resultado = await fs.promises.readFile(this.#path, 'utf-8')
        const data = JSON.parse(resultado)
        return data.payload
    }
}

//UsersManager.CrearUsuarios('Lautaro', 'Tello', 23, 'BACKEND II')
try {
    console.log(await UsersManager.ConsultarUsuarios())
} catch (err) {
    console.error(err)
}