import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListServiciosPage } from './list-servicios.page';

describe('ListServiciosPage', () => {
  let component: ListServiciosPage;
  let fixture: ComponentFixture<ListServiciosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
