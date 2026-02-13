import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListProductosPage } from './list-productos.page';

describe('ListProductosPage', () => {
  let component: ListProductosPage;
  let fixture: ComponentFixture<ListProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
