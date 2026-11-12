import { createClient } from '@supabase/supabase-js'

const supabase = () => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const allowed = new Set(['stage1','stage2','egr','coding','diagnostics'])
export default async function handler(req,res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'})
  const {make,model,service,date,time,phone,comment=''} = req.body || {}
  if (![make,model,service,date,time,phone].every(v=>typeof v==='string' && v.trim()) || !allowed.has(service)) return res.status(400).json({error:'Заполните обязательные поля'})
  if (phone.length > 40 || comment.length > 1000) return res.status(400).json({error:'Слишком длинное значение'})
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({error:'Сервис заявок ещё не настроен'})
  const {error} = await supabase().from('bookings').insert([{make,model,service,date,time,phone,comment}])
  if (error) return res.status(500).json({error:'Не удалось сохранить заявку'})
  return res.status(201).json({ok:true})
}