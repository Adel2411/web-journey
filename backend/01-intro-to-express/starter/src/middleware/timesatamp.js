export  default function timestamp(req, res, next) {
    if(req.method==='POST'){
        req.body.createdAt=new Date().toISOString()
        req.body.updatedAt=new Date().toISOString()

    }else if(req.method==='PUT'){
        req.body.updatedAt=new Date().toISOString()
    }
    next()
}