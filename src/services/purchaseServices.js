import { addPurchasePer, getMonthlySeriesForChartPer } from "../persistence/purchaseData.js"


export const addPurchaseSer = async(product) => {
    return await addPurchasePer(product)
}

export const getMonthlySeriesForChartSer = async (userId, {year}) => {
    return await getMonthlySeriesForChartPer(userId, { year });
}   