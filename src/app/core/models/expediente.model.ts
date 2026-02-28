/** Tipo de documento del solicitante */
export type TipoDoc = 'DNI' | 'RUC';

export type TipoTramite =
  | 'Licencia de Funcionamiento'
  | 'Constancia de Posesión'
  | 'Autorización de Evento Vecinal'
  | 'Certificado de Inspección Técnica (ITSE)'
  | 'Solicitud de Copia de Documentos'
  | 'Solicitud de Certificado de Numeración'
  | 'Constancia de Residencia'
  | 'Autorización de Comercio Ambulatorio (Temporal)'
  | 'Solicitud de Atención de Parques y Jardines';

export type EstadoExpediente = 'Recibido' | 'En evaluación' | 'Aprobado' | 'Observado';

/** Entidad principal del sistema de Mesa de Partes */
export interface Expediente {
  id?: number;
  codigo: string;
  tipoDoc: TipoDoc;
  nroDoc: string;
  solicitante: string;
  tramite: TipoTramite;
  fechaIngreso: string; // formato YYYY-MM-DD
  estado: EstadoExpediente;
  observacion?: string;
}
