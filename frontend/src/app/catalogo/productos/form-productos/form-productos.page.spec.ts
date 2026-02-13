import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormProductosPage } from './form-productos.page';

describe('FormProductosPage', () => {
  let component: FormProductosPage;
  let fixture: ComponentFixture<FormProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
