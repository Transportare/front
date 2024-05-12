import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiasDeSalidaComponent } from './guias-de-salida.component';

describe('GuiasDeSalidaComponent', () => {
  let component: GuiasDeSalidaComponent;
  let fixture: ComponentFixture<GuiasDeSalidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuiasDeSalidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuiasDeSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
