import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFacturasPage } from './form-facturas.page';

describe('FormFacturasPage', () => {
  let component: FormFacturasPage;
  let fixture: ComponentFixture<FormFacturasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFacturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
