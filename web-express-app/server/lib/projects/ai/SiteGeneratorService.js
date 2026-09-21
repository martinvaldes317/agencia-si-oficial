// Futuro: recibe el brief de AIProjectService y produce una versión del sitio. Sin implementación por ahora.
const SiteGeneratorService = {
  enabled: false,
  async generate(_brief) { const e = new Error('Funcionalidad próximamente disponible'); e.code = 'NOT_AVAILABLE'; throw e; },
};
module.exports = SiteGeneratorService;
