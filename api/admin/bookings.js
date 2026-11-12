import crypto from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
function valid(token,secret) {
  try {
    const decoded=Buffer.from(token,'base64url').toString()
    const parts=decoded.split(':'); if(parts.length!==3) return false
    const [ts,nonce,sig]=parts
    if(!/^\\d+$/.test(ts) || Date.now()-Number(ts)>12*60*60*1000 || Number(ts)>Date.now()+60000) return false
    const expected=crypto.createHmac('sha256',secret).update(`${ts}:${nonce}`).digest('hex')
    const a=Buffer.from(sig),b=Buffer.from(expected)
    return a.length===b.length && crypto.timingSafeEqual(a,b)
  } catch { return false }
}
export default async function handler(req,res) {
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'})
  const secret=process.env.ADMIN_PASSWORD
  const token=(req.headers.authorization||'').replace(/^Bearer\\s+/i,'')
  if(!secret || !valid(token,secret)) return res.status(401).json({error:'Нет доступа или сессия истекла'})
  const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY)
  const {data,error}=await db.from('bookings').select('*').order('created_at',{ascending:false}).limit(200)
  if(error) return res.status(500).json({error:'Не удалось загрузить заявки'})
  return res.status(200).json({bookings:data})
}