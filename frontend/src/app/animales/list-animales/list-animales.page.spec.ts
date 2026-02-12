import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListAnimalesPage } from './list-animales.page';

describe('ListAnimalesPage', () => {
  let component: ListAnimalesPage;
  let fixture: ComponentFixture<ListAnimalesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAnimalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
