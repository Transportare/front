import { Component, OnInit } from '@angular/core';
import { PersonalService } from '@services/shared/personal.service';
import { Observable } from 'rxjs';
import { GenericPersonal } from '@models/personal';
import { finalize, tap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Grupo } from '@models/grupo';
import { GuiasSalidasService } from './services/guias-salidas.service';
import { GuiasDeSalidaParams, GuiasDeSalida } from './models/guias-de-salida.model';

@Component({
  selector: 'app-guias-de-salida',
  templateUrl: './guias-de-salida.component.html',
  styleUrls: ['./guias-de-salida.component.scss'],
})
export class GuiasDeSalidaComponent implements OnInit {
  messangers$: Observable<GenericPersonal[]>;
  loading: boolean;
  loaderTable: boolean;
  form: FormGroup;
  messengerSelected: Grupo;
  guides$: Observable<GuiasDeSalida[]>;

  constructor(
    private _personalService: PersonalService,
    private _guiasSalidasService: GuiasSalidasService,
    private fb: FormBuilder
  ) {
    this.messangers$ = new Observable();
    this.form = this.fb.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      messangerId: [null, [Validators.required]],
    });
    this.messengerSelected = { id: null, text: 'Seleccione', grupo: '' };
    this.guides$ = new Observable();
    this.loading = false;
    this.loaderTable = false;
  }

  ngOnInit(): void {
    this.getMessangers();
  }

  getMessangers(): void {
    this.messangers$ = this._personalService.getMessengers().pipe(
      tap((_) => (this.loading = true)),
      finalize(() => (this.loading = false))
    );
  }

  changeMessanger(event) {
    this.form.patchValue({
      messangerId: event?.id,
    });
  }

  submit() {
    const params: GuiasDeSalidaParams = {
      fechaInicio: this.form.value?.startDate,
      fechaFin: this.form.value?.endDate,
      idPersonal: this.form.value?.messangerId,
    };

    this.guides$ = this._guiasSalidasService.getDetailsGuiasConsulta(params).pipe(
      tap((_) => (this.loaderTable = true)),
      finalize(() => (this.loaderTable = false))
    );
  }
}
