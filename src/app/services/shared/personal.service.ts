import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { API_URL } from 'config/api.route';
import { PersonalApi, GenericPersonal } from '@models/personal';
import { createMessengerAdapter } from '../../adapters/personal.adapter';

@Injectable({
  providedIn: 'root',
})
export class PersonalService {
  constructor(private http: HttpClient) {}

  getMessengers(): Observable<GenericPersonal[]> {
    return this.http
      .get<{ data: PersonalApi[] }>(`${API_URL}personales/byTipoPersonal/32`)
      .pipe(map((response) => response.data.map((personal: PersonalApi): GenericPersonal => createMessengerAdapter(personal))));
  }
}
