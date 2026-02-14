import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListHistorialesPage } from './list-historiales.page';

describe('ListHistorialesPage', () => {
  let component: ListHistorialesPage;
  let fixture: ComponentFixture<ListHistorialesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHistorialesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
