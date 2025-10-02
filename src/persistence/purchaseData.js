import { PurchaseServices } from "../dao/mongo/purchaseServices.js";

const purchase = new PurchaseServices()


export const addPurchasePer = async (product) => {
   return await purchase.addPurchase(product)
}