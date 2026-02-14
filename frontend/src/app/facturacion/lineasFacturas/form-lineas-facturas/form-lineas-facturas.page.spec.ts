import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormLineasFacturasPage } from './form-lineas-facturas.page';

describe('FormLineasFacturasPage', () => {
  let component: FormLineasFacturasPage;
  let fixture: ComponentFixture<FormLineasFacturasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLineasFacturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
