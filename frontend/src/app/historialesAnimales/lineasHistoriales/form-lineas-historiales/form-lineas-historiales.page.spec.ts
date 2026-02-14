import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormLineasHistorialesPage } from './form-lineas-historiales.page';

describe('FormLineasHistorialesPage', () => {
  let component: FormLineasHistorialesPage;
  let fixture: ComponentFixture<FormLineasHistorialesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLineasHistorialesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
