import { PurchaseServices } from "../dao/mongo/purchaseServices.js";

const purchase = new PurchaseServices()


export const addPurchasePer = async (product) => {
   return await purchase.addPurchase(product)
}

export const getMonthlySeriesForChartPer = async (userId, {year}) => {
    return await purchase.getMonthlySeriesForChart(userId, { year });
}