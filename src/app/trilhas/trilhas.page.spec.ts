import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrilhasPage } from './trilhas.page';

describe('TrilhasPage', () => {
  let component: TrilhasPage;
  let fixture: ComponentFixture<TrilhasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrilhasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrilhasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
