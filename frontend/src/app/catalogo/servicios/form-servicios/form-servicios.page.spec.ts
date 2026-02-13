import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormServiciosPage } from './form-servicios.page';

describe('FormServiciosPage', () => {
  let component: FormServiciosPage;
  let fixture: ComponentFixture<FormServiciosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
