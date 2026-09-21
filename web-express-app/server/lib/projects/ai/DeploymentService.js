// Futuro: orquesta un DeploymentProviderInterface para publicar staging/producción.
const DeploymentService = {
  enabled: false,
  provider: null, // se asignará una instancia de DeploymentProviderInterface
  async deploy(_project, _target) { const e = new Error('Funcionalidad próximamente disponible'); e.code = 'NOT_AVAILABLE'; throw e; },
};
module.exports = DeploymentService;
