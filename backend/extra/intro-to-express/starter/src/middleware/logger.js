// export default function logger(req, res, next) {
//   console.log("Request Headers:", req.headers);
//   next();
// }

export const logger = (req,res,next)=>{
    const method = req.method
    const route = req.url
    const header = req.headers
    const body = req.body
    const time = new Date().toISOString()
    console.log(method,route,header,body,time)
    next()
}
