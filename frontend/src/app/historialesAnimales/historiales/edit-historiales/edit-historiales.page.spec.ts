import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditHistorialesPage } from './edit-historiales.page';

describe('EditHistorialesPage', () => {
  let component: EditHistorialesPage;
  let fixture: ComponentFixture<EditHistorialesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHistorialesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
