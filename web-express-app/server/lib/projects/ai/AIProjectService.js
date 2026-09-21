// Capa de IA (aún sin proveedor). Su único trabajo hoy es entregar el JSON estructurado del proyecto,
// que es el contrato de entrada para un futuro agente (Claude, Codex u otro).
const { buildProjectJson } = require('../logic');

const AIProjectService = {
  enabled: false,
  buildBrief: (project, client, info, files, versions) => buildProjectJson(project, client, info, files, versions),
};
module.exports = AIProjectService;
