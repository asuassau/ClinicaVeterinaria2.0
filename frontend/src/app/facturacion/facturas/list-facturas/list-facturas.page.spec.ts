import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListFacturasPage } from './list-facturas.page';

describe('ListFacturasPage', () => {
  let component: ListFacturasPage;
  let fixture: ComponentFixture<ListFacturasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFacturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
