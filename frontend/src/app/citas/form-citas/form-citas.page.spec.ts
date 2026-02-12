import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormCitasPage } from './form-citas.page';

describe('FormCitasPage', () => {
  let component: FormCitasPage;
  let fixture: ComponentFixture<FormCitasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCitasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
