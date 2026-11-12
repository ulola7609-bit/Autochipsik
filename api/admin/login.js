import crypto from 'node:crypto'
export default async function handler(req,res) {
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'})
  const {password=''}=req.body || {}
  const secret=process.env.ADMIN_PASSWORD
  if(!secret) return res.status(500).json({error:'ADMIN_PASSWORD не настроен'})
  const a=Buffer.from(String(password)), b=Buffer.from(secret)
  if(a.length!==b.length || !crypto.timingSafeEqual(a,b)) return res.status(401).json({error:'Неверный пароль'})
  const token=crypto.randomBytes(32).toString('hex')
  // Stateless short-lived signed token: token is HMAC of timestamp + nonce.
  const payload=`${Date.now()}:${crypto.randomBytes(16).toString('hex')}`
  const signed=crypto.createHmac('sha256',secret).update(payload).digest('hex')
  return res.status(200).json({token:Buffer.from(`${payload}:${signed}`).toString('base64url')})
}