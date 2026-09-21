// Futuro: transforma el feedback del cliente (PjFeedback.originalText) en un prompt procesado (aiPrompt)
// y aplica los cambios sobre una nueva versión.
const RevisionService = {
  enabled: false,
  async processFeedback(_feedback, _brief) { const e = new Error('Funcionalidad próximamente disponible'); e.code = 'NOT_AVAILABLE'; throw e; },
};
module.exports = RevisionService;
