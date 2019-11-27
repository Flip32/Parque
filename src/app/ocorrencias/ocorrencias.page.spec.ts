import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OcorrenciasPage } from './ocorrencias.page';

describe('OcorrenciasPage', () => {
  let component: OcorrenciasPage;
  let fixture: ComponentFixture<OcorrenciasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcorrenciasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcorrenciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
