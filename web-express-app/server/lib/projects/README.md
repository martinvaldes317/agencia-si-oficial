# Módulo "Proyectos Web" (gestión de clientes y producción)

Módulo interno del admin (`/admin/proyectos`) para llevar el ciclo completo de un cliente:
lead → abono 50% → formulario → desarrollo → versiones/feedback → aprobación → saldo → publicación.

## Estructura
| Archivo | Rol |
|---|---|
| `constants.js` | Estados, colores, columnas Kanban, etapas del pipeline, plantillas por defecto. **Única fuente de verdad**: el frontend las recibe por `GET /api/projects/meta`. |
| `db.js` | Pool `mysql2` propio + migraciones versionadas (`PjMeta.schema_version`). Para cambiar el esquema agregar `{ v: N, sql: [...] }` a `MIGRATIONS`; nunca editar una migración ya aplicada. |
| `logic.js` | Lógica pura sin DB: montos (neto+IVA, abono, saldo), **próxima acción**, calidad de información, JSON estructurado para IA. |
| `service.js` | Operaciones sobre las tablas `Pj*` + auditoría (`PjAudit`) + integración con el formulario y Mercado Pago. |
| `ai/` | Servicios **sin proveedor** (`AIProjectService`, `SiteGeneratorService`, `DeploymentService`, `RevisionService`, `DeploymentProviderInterface`). |
| `../../routes/projects.js` | API REST `/api/projects/*`, solo admin (JWT). |

Frontend: `client/src/components/projects/`.

## Tablas (todas nuevas, prefijo `Pj`; no tocan tablas existentes)
`PjClient`, `PjProject`, `PjPayment`, `PjVersion`, `PjFeedback`, `PjFile`, `PjAudit`, `PjTemplate`, `PjWebhookLog`, `PjMeta`.

## Integración con el flujo existente (aislada, nunca rompe el checkout)
- `POST /api/web-orders` (formulario `/sitio-web/formulario`): tras crear el pedido, `syncFromOrder()` busca cliente por email/WhatsApp, lo crea si no existe, crea el proyecto en **Información completa / Abono pendiente**, mapea la información y registra los archivos que el formulario ya guardó en `uploads/orders/`. Es idempotente por `orderId` y corre sin `await` con `.catch`.
- Webhook Mercado Pago: `onMpPayment()` registra el abono (idempotente por `mpPaymentId`, índice único) y deja log en `PjWebhookLog`. Guarda `payment_id`, `status`, `external_reference`, `payment_type`, `merchant_order_id`.
- `POST /api/projects/sync/orders` importa pedidos anteriores (botón en Configuración).

## Estados y próxima acción
Los cambios de estado pasan por `changeStatus()` (guarda estado anterior/nuevo/usuario/fecha en `PjAudit`). Crear/actualizar versiones, registrar feedback y pagos mueven el estado automáticamente (`syncStatusFromVersion`, `registerPayment`).

## Preparado para el futuro (no implementado)
- `GET /api/projects/:id/ai/brief` entrega el JSON estructurado del proyecto (contrato de entrada para un agente).
- `POST /api/projects/:id/ai/generate` responde 501 "Funcionalidad próximamente disponible".
- Roles Ventas/Producción: hoy `actorOf()` en `routes/projects.js` devuelve `'admin'`. Al agregar cuentas de staff, resolver el actor desde el JWT y filtrar rutas por rol.
- Deploy: implementar `DeploymentProviderInterface`. **Nunca** guardar credenciales en tablas; usar variables de entorno.

## Seguridad
Todas las rutas exigen JWT de admin. Archivos privados (descarga solo autenticada, whitelist de extensión+MIME, 15 MB, ruta validada contra path traversal, SVG con CSP). Consultas parametrizadas (`?`). El frontend escapa por defecto (React).

## Notas de despliegue
Los archivos subidos van a `server/uploads/projects/<id>/` en disco: en Railway es efímero salvo que se monte un volumen. Igual que los logos de `uploads/orders/`.
