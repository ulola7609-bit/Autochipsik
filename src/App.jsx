import React, { useEffect, useState } from 'react'
import { ArrowUpRight, Zap, ShieldCheck, Gauge, Menu, X, Instagram, MapPin, Phone, CheckCircle2, Cpu, Activity, Wrench, CalendarDays, ArrowLeft, RefreshCw, LogOut, LockKeyhole } from 'lucide-react'
import { siteConfig } from '../config.js'

const services = [
  { id:'stage1', title:'Stage 1', subtitle:'Оптимизация заводской прошивки', price:'от 1 500 000', gain:'до +20–30%', icon:Zap, detail:'Индивидуальная калибровка под исправный автомобиль и качественное топливо.' },
  { id:'stage2', title:'Stage 2', subtitle:'Расширенная настройка под доработки', price:'от 2 500 000', gain:'зависит от конфигурации', icon:Gauge, detail:'Настройка с учётом аппаратных изменений. Итоговые параметры определяются после диагностики.' },
  { id:'egr', title:'EGR / катализатор', subtitle:'Программная диагностика и решения', price:'от 700 000', gain:'по состоянию авто', icon:Wrench, detail:'Сначала проверяем ошибки и состояние систем. Законность и экологические последствия обсуждаются до работ.' },
  { id:'coding', title:'Кодировка', subtitle:'Активация доступных функций', price:'от 300 000', gain:'комфорт и функции', icon:Cpu, detail:'Изменение доступных настроек электронных блоков конкретной модели.' },
  { id:'diagnostics', title:'Диагностика', subtitle:'Компьютерная проверка систем', price:'от 250 000', gain:'точная картина состояния', icon:Activity, detail:'Считывание ошибок, анализ параметров и рекомендации по дальнейшим действиям.' },
]
const makes = ['Chevrolet','BMW','Mercedes-Benz','Audi','Volkswagen','Toyota','Hyundai','Kia','Lexus','Porsche','Другая марка']
const models = {
  Chevrolet:['Cobalt','Malibu','Tracker','Equinox','Tahoe','Onix','Другая модель'],
  BMW:['1 Series','3 Series','5 Series','X3','X5','Другая модель'],
  'Mercedes-Benz':['A-Class','C-Class','E-Class','GLC','GLE','Другая модель'],
  Audi:['A3','A4','A6','Q5','Q7','Другая модель'],
  Volkswagen:['Golf','Passat','Tiguan','Touareg','Другая модель'],
  Toyota:['Camry','Corolla','Land Cruiser','RAV4','Другая модель'],
  Hyundai:['Elantra','Sonata','Tucson','Santa Fe','Другая модель'],
  Kia:['K5','Sportage','Sorento','Другая модель'],
  Lexus:['ES','RX','LX','Другая модель'],
  Porsche:['Cayenne','Macan','Panamera','Другая модель'],
  'Другая марка':['Укажу в комментарии'],
}

function BookingForm({ initialService='' }) {
  const [make,setMake] = useState('Chevrolet')
  const [model,setModel] = useState('Cobalt')
  const [service,setService] = useState(initialService)
  const [date,setDate] = useState('')
  const [time,setTime] = useState('10:00')
  const [phone,setPhone] = useState('')
  const [comment,setComment] = useState('')
  const [status,setStatus] = useState('idle')
  const [error,setError] = useState('')
  const submit = async (e) => {
    e.preventDefault(); setStatus('loading'); setError('')
    try {
      if (import.meta.env.BASE_URL === '/Autochip/') {
        throw new Error('Демо-версия на GitHub Pages не принимает заявки. Для реальной записи свяжитесь с нами по телефону или Instagram внизу страницы.')
      }
      const res = await fetch('/api/bookings', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ make, model, service, date, time, phone, comment }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Не удалось отправить заявку')
      setStatus('success')
    } catch (err) { setError(err.message || 'Ошибка соединения'); setStatus('error') }
  }
  return <form className="booking-form" onSubmit={submit}>
    <div className="form-head"><span className="eyebrow">ЗАПИСЬ В СЕРВИС</span><span className="form-step">01 / 02</span></div>
    <h3>Расскажите о своём автомобиле</h3>
    <p className="muted">Оставьте контакты — мастер свяжется с вами и подтвердит детали.</p>
    <div className="form-grid">
      <label>Марка автомобиля<select value={make} onChange={e=>{setMake(e.target.value);setModel(models[e.target.value]?.[0] || '')}}>{makes.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Модель<select value={model} onChange={e=>setModel(e.target.value)}>{(models[make] || ['Укажу в комментарии']).map(x=><option key={x}>{x}</option>)}</select></label>
      <label className="wide">Услуга<select required value={service} onChange={e=>setService(e.target.value)}><option value="">Выберите услугу</option>{services.map(s=><option value={s.id} key={s.id}>{s.title}</option>)}</select></label>
      <label>Удобная дата<input required type="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)} /></label>
      <label>Время<select value={time} onChange={e=>setTime(e.target.value)}>{['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map(t=><option key={t}>{t}</option>)}</select></label>
      <label className="wide">Телефон / Telegram<input required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+998 90 123 45 67" /></label>
      <label className="wide">Комментарий <span className="optional">(необязательно)</span><textarea rows="3" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Год выпуска, двигатель, пожелания..." /></label>
    </div>
    <button className="btn btn-primary submit-btn" disabled={status==='loading'}>{status==='loading'?'Отправляем...':'Отправить заявку'} <ArrowUpRight size={18}/></button>
    {status==='success' && <p className="success"><CheckCircle2 size={17}/> Заявка отправлена. Мы свяжемся с вами для подтверждения.</p>}
    {status==='error' && <p className="error">{error}. Проверьте подключение или напишите нам напрямую.</p>}
    <p className="fineprint">Отправляя форму, вы соглашаетесь на обработку данных для связи по заявке.</p>
  </form>
}

function Website() {
  const [menu,setMenu] = useState(false)
  const [chosen,setChosen] = useState('')
  const [booking,setBooking] = useState(false)
  const goBooking = (id='') => { setChosen(id); setBooking(true); setMenu(false); document.getElementById('booking')?.scrollIntoView({behavior:'smooth'}) }
  return <div className="app-shell">
    <div className="topline"><span><span className="live-dot"/> PERFORMANCE SOFTWARE LAB</span><span>ТАШКЕНТ · УЗБЕКИСТАН</span></div>
    <header className="nav wrap">
      <a className="brand" href="#"><span className="brand-mark"><Zap size={19} fill="currentColor"/></span><span>AUTOCHIP<span className="brand-dot">.</span><small>PERFORMANCE</small></span></a>
      <nav className={menu?'nav-links open':'nav-links'}><a href="#services" onClick={()=>setMenu(false)}>Услуги</a><a href="#process" onClick={()=>setMenu(false)}>Как работаем</a><a href="#booking" onClick={()=>setMenu(false)}>Запись</a><a href="#contacts" onClick={()=>setMenu(false)}>Контакты</a></nav>
      <a className="nav-cta" href="#booking">Записаться <ArrowUpRight size={16}/></a>
      <button className="menu-toggle" onClick={()=>setMenu(!menu)} aria-label="Открыть меню">{menu?<X/>:<Menu/>}</button>
    </header>
    <main>
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> ENGINEERED FOR MORE</div>
          <h1>Больше мощности.<br/><em>Больше контроля.</em></h1>
          <p className="hero-sub">Профессиональный чип-тюнинг и программное улучшение автомобилей в Узбекистане.</p>
          <div className="hero-actions"><button className="btn btn-primary" onClick={()=>goBooking()}>Записаться на настройку <ArrowUpRight size={18}/></button><a className="text-link" href="#services">Изучить услуги <span>↓</span></a></div>
          <div className="hero-stats"><div><strong>01</strong><span>Индивидуальный<br/>подход</span></div><div><strong>02</strong><span>Контроль параметров<br/>до и после</span></div><div><strong>03</strong><span>Приоритет —<br/>ресурс двигателя</span></div></div>
        </div>
        <div className="hero-visual">
          <div className="visual-glow"/><div className="visual-grid"/>
          <img className="hero-car" src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1500&q=85" alt="Спортивный автомобиль в тёмной студии"/>
          <div className="visual-overlay"/>
          <div className="visual-label"><span>ECU / TUNING</span><strong>PRECISION<br/>ENGINEERING</strong></div>
          <div className="visual-index">AC<span> / </span>001</div>
          <div className="visual-tag"><span className="live-dot"/> READY FOR THE NEXT LEVEL</div>
        </div>
      </section>
      <section className="trust-strip"><div className="wrap trust-inner"><div><ShieldCheck/><span><b>Бережный подход</b><small>Настройка после диагностики</small></span></div><div><Gauge/><span><b>Замеры параметров</b><small>Сравнение до и после — по запросу</small></span></div><div><CheckCircle2/><span><b>Прозрачные условия</b><small>Согласование работ заранее</small></span></div></div></section>
      <section id="services" className="section wrap">
        <div className="section-heading"><div><span className="eyebrow">01 — НАШИ ВОЗМОЖНОСТИ</span><h2>Настройка под<br/><em>ваши задачи.</em></h2></div><p>Не универсальные файлы, а технический подход к конкретному автомобилю. Стоимость и ожидаемый результат подтверждаются после уточнения конфигурации.</p></div>
        <div className="services-grid">{services.map((s,i)=>{const Icon=s.icon;return <article className="service-card" key={s.id}><div className="service-top"><span className="service-num">0{i+1}</span><Icon size={22}/></div><h3>{s.title}</h3><p>{s.subtitle}</p><div className="service-gain">{s.gain}</div><div className="service-bottom"><div><small>ОРИЕНТИРОВОЧНО</small><strong>{s.price} <small>сум</small></strong></div><button onClick={()=>goBooking(s.id)} aria-label={`Записаться: ${s.title}`}><ArrowUpRight/></button></div><p className="service-detail">{s.detail}</p></article>})}</div>
        <p className="disclaimer">* Цены и прирост мощности указаны ориентировочно. Фактический результат зависит от двигателя, состояния автомобиля, топлива и доступных измерений. Stage 2 выполняется только после оценки технической совместимости.</p>
      </section>
      <section id="process" className="process-section"><div className="wrap"><div className="section-heading"><div><span className="eyebrow">02 — ПРОЦЕСС</span><h2>Точность на<br/><em>каждом этапе.</em></h2></div><p>Сначала понимаем состояние автомобиля и вашу задачу. Затем предлагаем решение — без обещаний невозможного.</p></div><div className="process-grid"><div><span>01</span><h3>Диагностика</h3><p>Считываем ошибки и оцениваем исходное состояние систем.</p></div><div><span>02</span><h3>План настройки</h3><p>Обсуждаем доступные варианты, риски, стоимость и ожидаемый эффект.</p></div><div><span>03</span><h3>Калибровка</h3><p>Выполняем согласованные работы с учётом конфигурации авто.</p></div><div><span>04</span><h3>Проверка</h3><p>Проверяем работу систем и объясняем результаты владельцу.</p></div></div></div></section>
      <section id="booking" className="booking-section wrap"><div className="booking-intro"><span className="eyebrow">03 — СВЯЗАТЬСЯ С НАМИ</span><h2>Ваш автомобиль.<br/><em>Новый характер.</em></h2><p>Опишите задачу — подскажем, какие программные решения подходят вашему автомобилю.</p><div className="booking-note"><CalendarDays/><span>Заявка не является подтверждённой записью. Мы согласуем время лично.</span></div></div><BookingForm key={chosen} initialService={chosen}/></section>
    </main>
    <footer id="contacts"><div className="wrap footer-main"><a className="brand" href="#"><span className="brand-mark"><Zap size={19} fill="currentColor"/></span><span>AUTOCHIP<span className="brand-dot">.</span><small>PERFORMANCE</small></span></a><p>Инженерный подход к программному<br/>улучшению вашего автомобиля.</p><div className="footer-links"><a href={siteConfig.instagram} target="_blank" rel="noreferrer"><Instagram size={17}/> Instagram</a><a href={`tel:${siteConfig.phoneTel}`}><Phone size={17}/> {siteConfig.phoneDisplay}</a><a href={siteConfig.mapUrl} target="_blank" rel="noreferrer"><MapPin size={17}/> {siteConfig.address}</a></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Autochip.uz</span><span>BUILT FOR PERFORMANCE <span className="brand-dot">●</span></span>{import.meta.env.BASE_URL !== '/Autochip/' && <a href="/admin">Вход для мастера</a>}</div></footer>
  </div>
}


// Административная панель объединена с основным приложением, чтобы не плодить файлы.
function Admin() {
  const [password,setPassword] = useState('')
  const [token,setToken] = useState('')
  const [rows,setRows] = useState([])
  const [error,setError] = useState('')
  const [busy,setBusy] = useState(false)

  async function load(current=token) {
    if (!current) return
    setBusy(true); setError('')
    try {
      const response = await fetch('/api/admin/bookings', { headers: { Authorization: `Bearer ${current}` } })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Ошибка доступа')
      setRows(data.bookings || [])
    } catch (err) {
      setError(err.message)
      if (err.message.toLowerCase().includes('парол') || err.message.toLowerCase().includes('доступ')) setToken('')
    } finally { setBusy(false) }
  }

  async function login(event) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Не удалось войти')
      setToken(data.token)
      await load(data.token)
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  useEffect(() => {
    if (!token) return
    load(token)
    const interval = setInterval(() => load(token), 10000)
    return () => clearInterval(interval)
  }, [token])

  const logout = () => { setToken(''); setPassword(''); setRows([]) }

  return <div className="admin-page">
    <header className="admin-nav">
      <a href="/" className="brand"><span className="brand-mark">⚡</span><span>AUTOCHIP<span className="brand-dot">.</span><small>ADMIN</small></span></a>
      <a href="/" className="back-link"><ArrowLeft size={16}/> На сайт</a>
    </header>
    {!token ? <form className="login-card" onSubmit={login}>
      <LockKeyhole size={28}/><span className="eyebrow">PRIVATE ACCESS</span><h1>Панель мастера</h1>
      <p>Введите пароль администратора для просмотра заявок.</p>
      <input type="password" value={password} onChange={event=>setPassword(event.target.value)} placeholder="Пароль" required/>
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Проверка...' : 'Войти'}</button>
      {error && <p className="error">{error}</p>}
    </form> : <main className="admin-content">
      <div className="admin-title"><div><span className="eyebrow">AUTOCHIP / INBOX</span><h1>Новые заявки</h1><p className="muted">Автообновление каждые 10 секунд.</p></div>
        <div className="admin-actions"><button onClick={()=>load()} className="icon-btn" aria-label="Обновить"><RefreshCw size={17}/></button><button onClick={logout} className="icon-btn" aria-label="Выйти"><LogOut size={17}/></button></div>
      </div>
      {error && <p className="error">{error}</p>}
      {rows.length === 0 ? <div className="empty-state">Пока нет заявок. Новые обращения появятся здесь.</div> : <div className="requests">{rows.map(row=><article className="request-card" key={row.id}>
        <div className="request-meta"><b>#{String(row.id).slice(0,8)}</b><span>{new Date(row.created_at).toLocaleString('ru-RU')}</span><span className="status-pill">{row.status || 'Новая'}</span></div>
        <h3>{row.make} {row.model}</h3><p><b>Услуга:</b> {row.service}</p><p><b>Контакт:</b> <a href={`tel:${row.phone}`}>{row.phone}</a></p>
        <p><b>Дата и время:</b> {row.date} · {row.time}</p>{row.comment && <p><b>Комментарий:</b> {row.comment}</p>}
      </article>)}</div>}
    </main>}
  </div>
}

export default function App() {
  return window.location.pathname.startsWith('/admin') ? <Admin /> : <Website />
}
