import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListCitasPage } from './list-citas.page';

describe('ListCitasPage', () => {
  let component: ListCitasPage;
  let fixture: ComponentFixture<ListCitasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCitasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
