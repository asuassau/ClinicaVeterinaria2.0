import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditLineasFacturasPage } from './edit-lineas-facturas.page';

describe('EditLineasFacturasPage', () => {
  let component: EditLineasFacturasPage;
  let fixture: ComponentFixture<EditLineasFacturasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLineasFacturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
