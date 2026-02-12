import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUsuarioPage } from './edit-usuario.page';

describe('EditUsuarioPage', () => {
  let component: EditUsuarioPage;
  let fixture: ComponentFixture<EditUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
