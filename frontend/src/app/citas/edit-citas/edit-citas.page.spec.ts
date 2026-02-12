import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCitasPage } from './edit-citas.page';

describe('EditCitasPage', () => {
  let component: EditCitasPage;
  let fixture: ComponentFixture<EditCitasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCitasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
