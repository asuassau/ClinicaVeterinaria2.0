import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormHistorialesPage } from './form-historiales.page';

describe('FormHistorialesPage', () => {
  let component: FormHistorialesPage;
  let fixture: ComponentFixture<FormHistorialesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormHistorialesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
