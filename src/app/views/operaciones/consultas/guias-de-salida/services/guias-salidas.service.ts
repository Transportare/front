import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from 'config/api.route';

import { convertToHttpParams } from '@utils/convertToHttpParams';
import { ListDefault } from '@models/response-backend.model';

import {
  GuiasDeSalidaParams,
  GuiasDeSalidaResponse,
  GuiasDeSalida,
  createGuideAdapter,
} from '../models/guias-de-salida.model';

@Injectable({
  providedIn: 'root',
})
export class GuiasSalidasService {
  constructor(private http: HttpClient) {}

  getDetailsGuiasConsulta(params: GuiasDeSalidaParams): Observable<GuiasDeSalida[]> {
    return this.http
      .get<ListDefault<GuiasDeSalidaResponse[]>>(`${API_URL}guias/consulta/details`, {
        params: convertToHttpParams(params),
      })
      .pipe(map((response) => response.data.map((guide) => createGuideAdapter(guide))));
  }
}
