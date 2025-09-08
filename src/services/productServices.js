import { addingProductPer, allProductsPer, deleteProdPer } from "../persistence/productdata.js"




export const addingProductSer = async (product) => {
    return await addingProductPer(product)

}

export const allProductSer = async () => {
    return await allProductsPer()
}

export const deleteProductSer = async(id) => {
    await deleteProdPer(id)
}