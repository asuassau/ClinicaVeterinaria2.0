import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditServiciosPage } from './edit-servicios.page';

describe('EditServiciosPage', () => {
  let component: EditServiciosPage;
  let fixture: ComponentFixture<EditServiciosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
