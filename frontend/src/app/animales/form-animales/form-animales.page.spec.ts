import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormAnimalesPage } from './form-animales.page';

describe('FormAnimalesPage', () => {
  let component: FormAnimalesPage;
  let fixture: ComponentFixture<FormAnimalesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAnimalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
