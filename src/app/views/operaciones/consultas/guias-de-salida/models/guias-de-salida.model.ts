export interface GuiasDeSalidaParams {
  idPersonal: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface GuiasDeSalidaResponse {
  IdGuia: number;
  Personal: string;
  Distrito: string;
  FechaSalida: string;
  FechaCierre: string;
  Estado: string;
}

export interface GuiasDeSalida {
  idGuide: number;
  personal: string;
  district: string;
  dateStart: string;
  dateEnd: string;
  state: string;
}

export const createGuideAdapter = (guide: GuiasDeSalidaResponse): GuiasDeSalida => {
  return {
    idGuide: guide.IdGuia,
    dateEnd: guide.FechaCierre,
    dateStart: guide.FechaSalida,
    district: guide.Distrito,
    personal: guide.Personal,
    state: guide.Estado,
  };
};
