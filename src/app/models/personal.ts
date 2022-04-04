export class Personal {
  idPersonal: number;
  fecAsignacion: string;
  estado: number;
  idUbigeo: string;
  distrito: string;
  idDepartamento: string;
  idProvincia: string;
  codigo: string;
  nombres: string;
  apellidos: string;
  dni: string;
  fecNacimiento: string;
  direccion: string;
  idGenero: number;
  genero: string;
  idEstadoCivil: number;
  estadoCivil: string;
  telefono: string;
  fecIngreso: string;
  idTipoPersonal: number;
  tipoPersonal: string;
  sucursales: string[];

  constructor() {}
}

export interface GenericPersonal {
  grupo: string;
  id: number;
  text: string;
}

export interface PersonalApi {
  Codigo: string;
  DNI: string;
  IdPersonal: number;
  Nombres: string;
}
