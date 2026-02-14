import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditFacturasPage } from './edit-facturas.page';

describe('EditFacturasPage', () => {
  let component: EditFacturasPage;
  let fixture: ComponentFixture<EditFacturasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFacturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
