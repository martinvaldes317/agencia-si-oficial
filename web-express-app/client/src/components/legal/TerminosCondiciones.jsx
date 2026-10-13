import LegalPage, { Section } from './LegalPage'

export default function TerminosCondiciones() {
  return (
    <LegalPage title="Términos y Condiciones" updated="12 de septiembre de 2026">
      <Section title="1. Aceptación">
        <p>
          Al completar el formulario de contratación en agenciasi.cl y/o realizar un pago, aceptas estos Términos
          y Condiciones y nuestra <a href="/politica-privacidad">Política de Privacidad</a>. Si no estás de acuerdo,
          no completes la contratación y contáctanos para resolver tus dudas.
        </p>
      </Section>

      <Section title="2. Descripción del servicio">
        <p>El servicio "Sitio Web Profesional" incluye:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li>Diseño personalizado, adaptado a computadores, tablets y celulares.</li>
          <li>Hasta 5 secciones (secciones adicionales tienen un costo extra, ver punto 4).</li>
          <li>Dominio .CL durante el primer año.</li>
          <li>Hosting durante el primer año.</li>
          <li>3 correos electrónicos corporativos.</li>
          <li>Formulario de contacto, botón de WhatsApp e integración con Google Maps.</li>
          <li>Configuración básica para indexación en Google.</li>
        </ul>
      </Section>

      <Section title="3. Precio">
        <p>
          El sitio web tiene un único valor de $74.990 + IVA, contratado completando el formulario y pagando
          directamente en el sitio. Para iniciar el proyecto se solicita el pago de un abono del 50% del total
          (IVA incluido); el 50% restante se paga al finalizar el sitio web.
        </p>
      </Section>

      <Section title="4. Adicionales">
        <ul style={{ paddingLeft: 20 }}>
          <li><strong>Secciones adicionales</strong>: $9.990 + IVA por cada sección por sobre las 5 incluidas.</li>
          <li><strong>Tienda online</strong>: $25.990 + IVA adicionales. Incluye carro de compras, catálogo, carga
            inicial de hasta 25 productos e integración con Mercado Pago. Requiere que el comercio tenga (o cree)
            su propia cuenta de Mercado Pago — AgenciaSI no procesa ni recibe los pagos del comercio.</li>
          <li>Funcionalidades no descritas en estos términos pueden cotizarse por separado.</li>
        </ul>
      </Section>

      <Section title="5. Precios y pago">
        <p>
          Los precios están expresados en pesos chilenos (CLP) y no incluyen IVA salvo que se indique lo
          contrario. El pago se procesa a través de Mercado Pago; AgenciaSI no almacena
          datos de tarjetas de crédito o débito. El precio queda fijado una vez confirmado el pago del abono de tu pedido.
        </p>
      </Section>

      <Section title="6. Proceso de desarrollo y plazos">
        <p>
          Tras recibir tu información, te presentaremos un diseño para tu revisión y aprobación antes de continuar
          con el desarrollo final. Los plazos de entrega dependen de la rapidez con que se entregue la información
          y contenidos solicitados (textos, logo, fotografías) y de la complejidad del proyecto — te
          informaremos un plazo estimado durante el proceso.
        </p>
      </Section>

      <Section title="7. Dominio y hosting">
        <p>
          El dominio .CL y el hosting están incluidos sin costo durante el primer año. Antes del vencimiento, te
          informaremos el costo de renovación para que decidas si continuar con nosotros. Si ya cuentas con un
          dominio propio, coordinaremos su conexión sin necesidad de que nos compartas contraseñas o credenciales
          sensibles durante la contratación.
        </p>
      </Section>

      <Section title="8. Cancelación y reembolsos">
        <p>
          Puedes solicitar el reembolso completo de tu pago si aún no has aprobado el diseño propuesto. Una vez
          aprobado el diseño y comenzado el desarrollo, el proyecto se completa según lo contratado y no
          procederán reembolsos, salvo que exista un incumplimiento grave de nuestra parte. Para solicitar una
          cancelación, escríbenos a <a href="mailto:contacto@agenciasi.cl">contacto@agenciasi.cl</a>.
        </p>
      </Section>

      <Section title="9. Contenido y propiedad intelectual">
        <p>
          Eres responsable del contenido que nos entregues (textos, logo, fotografías) y declaras contar con los
          derechos necesarios para su uso. AgenciaSI se reserva el derecho de rechazar contenido ilegal, ofensivo
          o que infrinja derechos de terceros. El sitio web terminado queda a tu disposición para su uso comercial;
          el código base, componentes o plantillas reutilizables desarrollados por AgenciaSI permanecen bajo
          nuestra titularidad salvo acuerdo distinto por escrito.
        </p>
      </Section>

      <Section title="10. Limitación de responsabilidad">
        <p>
          Entregamos el servicio configurado e indexado para que Google pueda reconocerlo, pero no garantizamos
          una posición específica en los resultados de búsqueda, ya que esto depende de múltiples factores fuera
          de nuestro control. Tampoco somos responsables por interrupciones atribuibles a proveedores externos
          (Mercado Pago, hosting, registradores de dominio, Meta/Google) fuera de nuestro control razonable.
        </p>
      </Section>

      <Section title="11. Modificaciones">
        <p>
          Podemos actualizar estos Términos y Condiciones para reflejar cambios en nuestros servicios o en la
          normativa vigente. La versión aplicable a tu contratación es la vigente al momento de completar tu pago.
        </p>
      </Section>

      <Section title="12. Ley aplicable">
        <p>
          Estos términos se rigen por las leyes de la República de Chile. Cualquier controversia se resolverá ante
          los tribunales competentes de Chile, sin perjuicio de los derechos que te asisten como consumidor bajo
          la Ley N° 19.496.
        </p>
      </Section>
    </LegalPage>
  )
}
