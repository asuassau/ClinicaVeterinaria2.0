import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProductosPage } from './edit-productos.page';

describe('EditProductosPage', () => {
  let component: EditProductosPage;
  let fixture: ComponentFixture<EditProductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
