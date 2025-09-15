import { ProductServices } from "../dao/mongo/productServices.js";

const products =  new ProductServices()

export const addingProductPer =  async (product) => {
    return await products.addingProducts(product)

}

export const allProductsPer = async() => {
    return await products.allProducts()
}

export const deleteProdPer = async(id) => {
   return await products.deleteProduct(id)
}

export const updateProdPer = async (id,product) => {
  return await products.updateProducts(id,product)
}