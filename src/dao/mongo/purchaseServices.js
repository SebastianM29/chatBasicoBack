import mongoose from "mongoose";
import { makeMonthKey } from "../../helpers/dateMonthKey.js";
import Purchase from "../mongo/models/puchaseModels.js";




export class PurchaseServices {
    constructor(){

    }

    async addPurchase(product){
        console.log('decime que llega',product);     
        const check = [product.product,product.highestBid,product.highestBidder].every(Boolean)
        if (!check) {
            console.error(" Error en addPurchase:");
            return null;
         }
        try {
            console.log('se Puede grabar',check);

            const now = new Date();
            const monthKey  = makeMonthKey(now);
            const year = now.getFullYear();
            const monthNum = now.getMonth() + 1;


            const created = {
                product:product.product._id,
                buyer:product.highestBidder._id,
                finalPrice:product.highestBid,
                createdAt: now,
                monthKey,
                year,
                monthNum
            }
            const resp =  await Purchase.create(created)

            const dataResp = await Purchase.findById(resp._id)
            .populate("product",'productName price imagePath')
            .populate('buyer', 'nickname imagePath email')

            console.log('devolviendo lo que quedo grabado en el servicio',dataResp);        
            return dataResp
        } catch (error) {
            throw new Error("error al grabar",error);
            
        }
    }


    // Reporte mensual por usuario (opcionalmente filtrado por año)
    async getMonthlyReportByUser(userId, { year } = {}) {
      console.log('llegando usuario y año',userId,year);
      
    const match = { buyer: new mongoose.Types.ObjectId(userId) };
    // Si pasás un año, filtramos por prefijo "YYYY-"
    if (year) {
      match.monthKey = { $regex: `^${year}-` };
    }
    const rows = await Purchase.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$monthKey",
          total: { $sum: "$finalPrice" }, /** suma precios */
          count: { $sum: 1 } /** cantidad de compras */
        }
      },
      { $project: { _id: 0, monthKey: "$_id", total: 1, count: 1 } }, /** reformateo */ 
      { $sort: { monthKey: 1 } } /** orden ascendente por monthKey */
    ]);
    return rows; // p.ej. [{ monthKey: "2025-01", total: 320, count: 3 }, ...]
    }




    // 🆕 Versión “lista para Chart.js” (labels y data)
    async getMonthlySeriesForChart(userId, { year } = {}) {
    const rows = await this.getMonthlyReportByUser(userId, { year });
    // Si querés asegurar los 12 meses aunque no haya datos:
    const months = Array.from({ length: 12 }, (_, i) => /** Genera un string con el formato "YYYY-MM" */
      `${year ?? new Date().getUTCFullYear()}-${String(i + 1).padStart(2, "0")}`
    );
    const map = new Map(rows.map(r => [r.monthKey, r.total])); /** Map de monthKey → total */
    const labels = months;
    const data = months.map(mk => map.get(mk) ?? 0);
    return { labels, datasets: [{ label: "Total vendido", data }] };
    }


}