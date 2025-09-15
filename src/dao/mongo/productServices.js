
import fs from "fs-extra";
import Product from "../mongo/models/productModels.js";
import { fileURLToPath } from "url";
import path,{ dirname } from "path";
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


export class ProductServices {
    constructor() {

    }

    async addingProducts(product) {
        console.log('llega esto',product);
        
       if (![product.productName,product.price,product.description,product.imagePath].every(Boolean)) {
        return {
            error:true,
            msg:'faltan datos'
         }
       }

       try {
           const success = await Product.create(product)
      
           
           return  {
            error:false,
            data: success
           }
        
       } catch (error) {
           throw new Error('Error devolviendo porductos',error)
       }
       
    }

    async allProducts() {
        try {
            const data = await Product.find()
            if (data.length === 0 ) {
                return {
                    error:false,
                    msg:'no hay productos'  
                }
            } 
            console.log(data);
            
            return data
            
        } catch (error) {
            throw new Error('Error devolviendo porductos.. peticion get',error)
            
        }
    }


    async deleteProduct(id) {
         if (!id ){
            return {
                error:true,
                msg:'id no suministrado'
            }
            
         }

        try {
            const resp = await Product.findByIdAndDelete(id)
            if (!resp) {
                return {
                    error:true,
                    msg:'no se encontro el producto'
                }
                
            }
           
           const imagePath = path.join(__dirname, '../../public', resp.imagePath.slice(1));
              console.log('ruta de la imagen a borrar',imagePath);
            await fs.unlink(imagePath)

            return {
                error:false,
                msg:'producto eliminado',
                data:resp
            }
            
        } catch (error) {
             throw new Error('Error devolviendo porductos',error)
        }
        
    }

    async updateProducts(id,products){
        if (!id || !products) {
             return {
                    error:true,
                    msg:'no se encontro el producto'
                }
            
        }
        try {
            
            const dataUpd = await Product.findByIdAndUpdate(id,products,{new:true})
            if (!dataUpd) {
                return {
                    error:true,
                    msg:'no se encontro el producto'
                }
            }

            return{
                error:false,
                data:dataUpd
            }
        } catch (error) {
            throw new Error("Error actualizando el producto",error);
            
        }
    }


}