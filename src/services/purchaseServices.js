import { addPurchasePer } from "../persistence/purchaseData.js"


export const addPurchaseSer = async(product) => {
    return await addPurchasePer(product)
}