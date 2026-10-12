import { CARBON, CARBON_PANEL, CARBON_PANEL_2, BLANCO_CALIDO, BLANCO_CALIDO_PANEL, BLANCO_CALIDO_PANEL_2, AZUL_CONEXION, AZUL_NIEBLA } from '../../theme/brand'

// Paleta de la landing /sitio-web (azul = acción, rojo = acento puntual).
// red/redD/blue son literales: acentos que se usan igual en ambos temas.
// blueD/text/grayTx/grayLt/cream/panel/ink SÍ cambian con el tema — son texto
// y superficies que viven directamente sobre el fondo de la página.
export const DARK_FP = {
  red:    '#C8302A',
  redD:   '#9E241F',
  blue:   AZUL_CONEXION,
  blueD:  AZUL_NIEBLA,
  cream:  CARBON,
  panel:  CARBON_PANEL,
  ink:    CARBON_PANEL_2,
  text:   '#f5f5fa',
  grayTx: '#9a9ab0',
  grayLt: '#6e6e85',
  border: 'rgba(255,255,255,0.09)',
  tint:   'rgba(255,255,255,0.05)',
}

export const LIGHT_FP = {
  red:    '#C8302A',
  redD:   '#9E241F',
  blue:   AZUL_CONEXION,
  blueD:  AZUL_CONEXION,
  cream:  BLANCO_CALIDO,
  panel:  BLANCO_CALIDO_PANEL,
  ink:    BLANCO_CALIDO_PANEL_2,
  text:   '#14141f',
  grayTx: '#5c5c72',
  grayLt: '#6b6b80',
  border: 'rgba(15,23,42,0.10)',
  tint:   'rgba(15,23,42,0.035)',
}
