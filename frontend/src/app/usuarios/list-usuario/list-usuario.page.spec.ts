import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListUsuarioPage } from './list-usuario.page';

describe('ListUsuarioPage', () => {
  let component: ListUsuarioPage;
  let fixture: ComponentFixture<ListUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
