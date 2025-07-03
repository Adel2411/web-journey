import express from "express"

export const addTime = (req, res, next) =>{
    const now = new Date().toISOString()

    if(req.method === "POST"){
        req.body.createdAt = now
        req.body.updatedAt = now
    } else {

        if( req.method === "PUT"){
        req.body.updatedAt = now
    }
    }

   

    next()
}