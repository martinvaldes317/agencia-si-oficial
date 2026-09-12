import LegalPage, { Section } from './LegalPage'

export default function PoliticaPrivacidad() {
  return (
    <LegalPage title="Política de Privacidad" updated="12 de septiembre de 2026">
      <Section title="1. Quiénes somos">
        <p>
          AgenciaSI ("nosotros", "AgenciaSI") es una empresa chilena de desarrollo web, marketing digital y
          servicios asociados. Somos responsables del tratamiento de los datos personales que recibimos a través
          de agenciasi.cl y de nuestros canales de contacto (WhatsApp, correo electrónico, formularios).
          Contacto: <a href="mailto:contacto@agenciasi.cl">contacto@agenciasi.cl</a> · +56 9 3293 0812.
        </p>
      </Section>

      <Section title="2. Qué datos recopilamos">
        <p>Dependiendo del formulario o servicio que utilices, podemos recopilar:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li>Datos de identificación: nombre, apellido, RUT y razón social (si los entregas para facturación).</li>
          <li>Datos de contacto: correo electrónico, WhatsApp/teléfono, dirección, comuna y región.</li>
          <li>Información de tu negocio: rubro, descripción, redes sociales, logo y fotografías que subas.</li>
          <li>Datos de la contratación: secciones elegidas, dominio, si contratas o no el módulo de tienda online.</li>
          <li>Datos de pago: procesados directamente por Mercado Pago — nosotros no almacenamos números de tarjeta.</li>
          <li>Datos de navegación: dirección IP, tipo de dispositivo y cookies de medición (ver sección 6).</li>
        </ul>
      </Section>

      <Section title="3. Para qué usamos tus datos">
        <ul style={{ paddingLeft: 20 }}>
          <li>Contactarte, cotizar y desarrollar el servicio que solicitaste.</li>
          <li>Procesar el pago de tu pedido a través de Mercado Pago.</li>
          <li>Emitir facturas o boletas cuando corresponda.</li>
          <li>Enviarte actualizaciones sobre tu proyecto (correo, WhatsApp).</li>
          <li>Medir el rendimiento de nuestras campañas publicitarias en Meta (Facebook/Instagram) y Google.</li>
          <li>Cumplir obligaciones legales y responder requerimientos de autoridades competentes.</li>
        </ul>
      </Section>

      <Section title="4. Con quién compartimos tu información">
        <p>No vendemos tus datos personales. Los compartimos únicamente con proveedores que nos ayudan a operar el servicio:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li><strong>Mercado Pago</strong>, para procesar tu pago.</li>
          <li><strong>Meta (Facebook/Instagram)</strong>, para medir conversiones de nuestras campañas — el correo y teléfono se envían de forma cifrada (hash) cuando corresponde, nunca en texto plano.</li>
          <li><strong>Proveedores de hosting, dominio y correo</strong> necesarios para prestar el servicio contratado.</li>
        </ul>
        <p style={{ marginTop: 8 }}>
          Algunos de estos proveedores pueden procesar datos fuera de Chile. En esos casos, exigimos que cumplan
          estándares adecuados de protección de datos.
        </p>
      </Section>

      <Section title="5. Tus derechos">
        <p>
          De acuerdo con la Ley N° 19.628 sobre Protección de la Vida Privada y la Ley N° 21.719, puedes solicitar
          en cualquier momento: acceder a tus datos, corregirlos, solicitar su eliminación, u oponerte a un uso
          específico. Para ejercer estos derechos, escríbenos a <a href="mailto:contacto@agenciasi.cl">contacto@agenciasi.cl</a> indicando tu nombre y la solicitud —
          responderemos dentro de un plazo razonable.
        </p>
      </Section>

      <Section title="6. Cookies y píxeles publicitarios">
        <p>Usamos dos tipos de cookies/tecnologías similares:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li><strong>Analíticas</strong> (Google Analytics): nos ayudan a entender cómo se usa el sitio, de forma agregada.</li>
          <li><strong>Publicitarias</strong> (Meta Pixel / Conversions API): nos permiten medir si nuestros anuncios en
            Facebook e Instagram generaron una visita, un contacto o una compra, y mostrar anuncios relevantes.</li>
        </ul>
        <p style={{ marginTop: 8 }}>
          Puedes desactivar las cookies desde la configuración de tu navegador en cualquier momento. Ten en cuenta
          que algunas funciones del sitio pueden verse afectadas si las bloqueas por completo.
        </p>
      </Section>

      <Section title="7. Seguridad y conservación">
        <p>
          Aplicamos medidas razonables de seguridad para proteger tu información contra accesos no autorizados.
          Conservamos tus datos mientras exista una relación comercial vigente o mientras sea necesario para
          cumplir obligaciones legales (por ejemplo, tributarias).
        </p>
      </Section>

      <Section title="8. Cambios a esta política">
        <p>
          Podemos actualizar esta política para reflejar cambios en nuestros servicios o en la legislación
          vigente. Publicaremos cualquier cambio relevante en esta misma página, indicando la fecha de la última
          actualización.
        </p>
      </Section>
    </LegalPage>
  )
}
