export default function logger(req, res, next) {

  const time = new Date().toISOString()

  console.log(`[${time}] ${req.method} ${req.url} - Headers: ${JSON.stringify(req.headers)} - Body: ${JSON.stringify(req.body)}`)

  next()
}
