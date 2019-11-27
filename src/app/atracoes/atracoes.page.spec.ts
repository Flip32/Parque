import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtracoesPage } from './atracoes.page';

describe('AtracoesPage', () => {
  let component: AtracoesPage;
  let fixture: ComponentFixture<AtracoesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtracoesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtracoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
