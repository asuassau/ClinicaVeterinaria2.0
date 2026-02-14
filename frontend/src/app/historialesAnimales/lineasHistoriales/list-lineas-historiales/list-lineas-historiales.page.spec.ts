import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListLineasHistorialesPage } from './list-lineas-historiales.page';

describe('ListLineasHistorialesPage', () => {
  let component: ListLineasHistorialesPage;
  let fixture: ComponentFixture<ListLineasHistorialesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLineasHistorialesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
