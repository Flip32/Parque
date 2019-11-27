import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcmbioPage } from './icmbio.page';

describe('IcmbioPage', () => {
  let component: IcmbioPage;
  let fixture: ComponentFixture<IcmbioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcmbioPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcmbioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
