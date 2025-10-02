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
            const created = {
                product:product.product._id,
                buyer:product.highestBidder._id,
                finalPrice:product.highestBid,
            }
            const resp =  await Purchase.create(created)
            const dataResp = await Purchase.findById(resp._id).populate("product",'productName price imagepath').populate('buyer', 'nickname imagePath email')
            console.log('devolviendo lo que quedo grabado',dataResp);
            
            return dataResp
        } catch (error) {
            throw new Error("error al grabar",error);
            
        }
    }
}