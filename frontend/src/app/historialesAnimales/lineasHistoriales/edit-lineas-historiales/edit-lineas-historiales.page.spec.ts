import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditLineasHistorialesPage } from './edit-lineas-historiales.page';

describe('EditLineasHistorialesPage', () => {
  let component: EditLineasHistorialesPage;
  let fixture: ComponentFixture<EditLineasHistorialesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLineasHistorialesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
