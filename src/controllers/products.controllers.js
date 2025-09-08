import { request, response } from "express";
import { addingProductSer, allProductSer, deleteProductSer } from "../services/productServices.js";


 
export const add = async (req=request,res=response)  => {
    try {
        const {productName,price,description,} = req.body
        const imagePath = '/img/' + req.file.filename
        const product = {
            productName,
            price,
            description,
            imagePath
        }
        const resp = await addingProductSer(product)
        if (resp.error) {
            return res.status(400).json({
                msg:resp.msg 
            })
        }
        console.log('estoy recibiendo esto',resp.data);
        
        res.json(resp.data)
        
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({
            msg: 'Internal server error'
        }); 
    }

}


export const allProducts = async (req=request,res=response) => {
    try {
         console.log('llegando');
         const data = await allProductSer()

         if (data.error) {
           return res.status(400).json({
            msg:data.msg
           })
         }
        res.json(data)
        
    } catch (error) {
        res.status(500).json({
            msg:'Internal error'
        })
        
    }
}

export const deletProduct = async(req=request,res=response) => {
    try {
        const {id} = req.params
        const resp = deleteProductSer(id)
        if(resp.error) {
            return res.status(400).json({
                msg:resp.msg
            })
        }

        res.json({
            msg:'producto Borrado',
            prod: resp.data
        })
    } catch (error) {
        res.status(500).json({
            msg:'internal error'
        })
        
    }
}