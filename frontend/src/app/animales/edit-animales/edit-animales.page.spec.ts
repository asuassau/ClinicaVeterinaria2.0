import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAnimalesPage } from './edit-animales.page';

describe('EditAnimalesPage', () => {
  let component: EditAnimalesPage;
  let fixture: ComponentFixture<EditAnimalesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAnimalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
