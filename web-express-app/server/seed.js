const bcrypt = require('bcryptjs')
const prisma = require('./lib/prisma')

async function main() {
  const password = await bcrypt.hash('demo1234', 10)

  const client = await prisma.client.upsert({
    where: { email: 'demo@agenciasi.cl' },
    update: {},
    create: {
      name: 'Demo Cliente',
      email: 'demo@agenciasi.cl',
      password,
      company: 'Empresa Demo SpA',
      phone: '+56 9 1234 5678',
      plan: 'ads',
      metrics: {
        create: [
          { date: new Date('2025-03-01'), platform: 'meta', impressions: 45200, clicks: 1356, spend: 180000, conversions: 28, revenue: 520000 },
          { date: new Date('2025-03-08'), platform: 'meta', impressions: 51800, clicks: 1607, spend: 210000, conversions: 35, revenue: 680000 },
          { date: new Date('2025-03-15'), platform: 'google', impressions: 28400, clicks: 980, spend: 95000, conversions: 19, revenue: 310000 },
          { date: new Date('2025-03-22'), platform: 'meta', impressions: 63100, clicks: 2144, spend: 240000, conversions: 42, revenue: 890000 },
          { date: new Date('2025-03-29'), platform: 'google', impressions: 31500, clicks: 1102, spend: 110000, conversions: 24, revenue: 420000 },
        ].map(m => ({
          ...m,
          ctr: (m.clicks / m.impressions) * 100,
          cpc: m.spend / m.clicks,
          roas: m.revenue / m.spend,
        }))
      },
      payments: {
        create: [
          { amount: 350000, description: 'Gestión mensual Enero', status: 'pagado', paidAt: new Date('2025-01-05') },
          { amount: 350000, description: 'Gestión mensual Febrero', status: 'pagado', paidAt: new Date('2025-02-03') },
          { amount: 350000, description: 'Gestión mensual Marzo', status: 'pendiente', dueDate: new Date('2025-04-05') },
        ]
      },
      meetings: {
        create: [
          { title: 'Reunión de onboarding', date: new Date('2025-01-10T10:00:00'), duration: 60, status: 'completada', description: 'Kickoff del proyecto' },
          { title: 'Revisión de campañas Febrero', date: new Date('2025-02-14T15:00:00'), duration: 45, status: 'completada', meetLink: 'https://meet.google.com/abc-defg-hij' },
          { title: 'Revisión mensual Abril', date: new Date('2025-04-10T11:00:00'), duration: 60, status: 'programada', meetLink: 'https://meet.google.com/xyz-abcd-efg', description: 'Análisis de resultados Q1 y planificación Q2' },
        ]
      },
      tickets: {
        create: [
          {
            subject: 'Error en formulario de contacto del sitio web',
            status: 'resuelto',
            priority: 'alta',
            messages: {
              create: [
                { content: 'Hola, el formulario de contacto no está enviando los correos correctamente. Los clientes llenan el formulario pero no llega nada.', isAdmin: false },
                { content: 'Hola Demo, revisamos el servidor SMTP y había un problema con las credenciales. Ya está solucionado. Haz una prueba y nos confirmas.', isAdmin: true },
                { content: 'Perfecto, ya funciona. Muchas gracias por la rapidez.', isAdmin: false },
              ]
            }
          },
          {
            subject: 'Consulta sobre presupuesto de anuncios para Abril',
            status: 'abierto',
            priority: 'normal',
            messages: {
              create: [
                { content: '¿Recomiendan aumentar el presupuesto de Meta Ads para Abril dado los resultados de Marzo?', isAdmin: false },
              ]
            }
          }
        ]
      }
    }
  })

  console.log(`✓ Demo creado: ${client.email} — demo1234`)

  // ── AGENCIA GLOBAL SPA ───────────────────────────────────────────────────
  const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 15)

  const c1 = await prisma.client.upsert({
    where: { email: 'contacto@agenciasi.cl' },
    update: {},
    create: {
      email: 'contacto@agenciasi.cl',
      password: await bcrypt.hash('cliente123', 10),
      name: 'AGENCIA GLOBAL SPA',
      company: 'AGENCIA GLOBAL SPA',
      plan: 'web-express',
      active: false,
      domainName: 'agenciaglobal.cl',
      hostingProvider: 'Railway',
      monthlyFee: 41240,
      hostingCost: 41240,
      domainCost: 9990,
      services: {
        create: [
          { name: 'Hosting',   type: 'anual',  amount: 41240,  active: true, saleDate: new Date('2026-01-10') },
          { name: 'Sitio Web', type: 'unico',  amount: 129990, active: true, saleDate: new Date('2026-01-10') },
          { name: 'Dominio',   type: 'anual',  amount: 9990,   active: true, saleDate: new Date('2026-01-10') },
        ]
      },
      payments: {
        create: [
          { amount: 129990, description: 'Sitio Web Profesional Express', status: 'pagado', paidAt: thisMonth, dueDate: thisMonth },
          { amount: 41240,  description: 'Hosting anual',                 status: 'pagado', paidAt: thisMonth, dueDate: thisMonth },
          { amount: 9990,   description: 'Dominio .cl',                   status: 'pagado', paidAt: thisMonth, dueDate: thisMonth },
        ]
      }
    }
  })
  console.log(`✓ Creado: ${c1.email} — cliente123`)

  // ── Javiera Caceres / COEXCA ─────────────────────────────────────────────
  const c2 = await prisma.client.upsert({
    where: { email: 'coexaa@gmail.com' },
    update: {},
    create: {
      email: 'coexaa@gmail.com',
      password: await bcrypt.hash('cliente123', 10),
      name: 'Javiera Caceres',
      company: 'COEXCA',
      plan: 'full',
      active: true,
      domainName: 'coexca.cl',
      hostingProvider: 'Railway',
      monthlyFee: 40000,
      hostingCost: 41240,
      domainCost: 9990,
      services: {
        create: [
          { name: 'Hosting',       type: 'anual',   amount: 41240,  active: true, saleDate: new Date('2025-11-01') },
          { name: 'Meta Ads',      type: 'mensual', amount: 40000,  active: true, saleDate: new Date('2025-11-01') },
          { name: 'Asesorías 1:1', type: 'unico',   amount: 499990, active: true, saleDate: new Date('2025-12-15') },
        ]
      },
      payments: {
        create: [
          { amount: 499990, description: 'Asesorías 1:1 pack completo', status: 'pagado', paidAt: new Date('2025-12-20'), dueDate: new Date('2025-12-20') },
          { amount: 41240,  description: 'Hosting anual',               status: 'pagado', paidAt: new Date('2025-11-05'), dueDate: new Date('2025-11-05') },
          { amount: 40000,  description: 'Meta Ads — noviembre',        status: 'pagado', paidAt: new Date('2025-11-30'), dueDate: new Date('2025-11-30') },
          { amount: 40000,  description: 'Meta Ads — diciembre',        status: 'pagado', paidAt: new Date('2025-12-31'), dueDate: new Date('2025-12-31') },
          { amount: 40000,  description: 'Meta Ads — enero',            status: 'pagado', paidAt: new Date('2026-01-31'), dueDate: new Date('2026-01-31') },
          { amount: 40000,  description: 'Meta Ads — febrero',          status: 'pagado', paidAt: new Date('2026-02-28'), dueDate: new Date('2026-02-28') },
          { amount: 40000,  description: 'Meta Ads — marzo',            status: 'pagado', paidAt: new Date('2026-03-31'), dueDate: new Date('2026-03-31') },
          { amount: 40000,  description: 'Meta Ads — abril',            status: 'pagado', paidAt: thisMonth,             dueDate: thisMonth },
        ]
      }
    }
  })
  console.log(`✓ Creado: ${c2.email} — cliente123`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
