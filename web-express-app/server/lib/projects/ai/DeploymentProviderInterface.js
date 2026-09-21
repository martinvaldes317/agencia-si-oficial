// Contrato para proveedores de despliegue futuros (Hostinger, SSH, Git…). Aún no hay implementaciones.
// Las credenciales NUNCA se guardan en tablas del módulo: viven en variables de entorno del proveedor.
class DeploymentProviderInterface {
  get name() { throw new Error('not implemented'); }
  async deployStaging(_project, _bundle) { throw new Error('not implemented'); }
  async deployProduction(_project, _bundle) { throw new Error('not implemented'); }
  async status(_project) { throw new Error('not implemented'); }
}
module.exports = DeploymentProviderInterface;
