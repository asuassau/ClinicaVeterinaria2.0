import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuCatalogoPage } from './menu-catalogo.page';

describe('MenuCatalogoPage', () => {
  let component: MenuCatalogoPage;
  let fixture: ComponentFixture<MenuCatalogoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCatalogoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
