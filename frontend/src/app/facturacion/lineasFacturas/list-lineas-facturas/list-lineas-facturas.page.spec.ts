import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListLineasFacturasPage } from './list-lineas-facturas.page';

describe('ListLineasFacturasPage', () => {
  let component: ListLineasFacturasPage;
  let fixture: ComponentFixture<ListLineasFacturasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLineasFacturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
