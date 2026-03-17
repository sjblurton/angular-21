import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';

import { TodoFiltersPanelComponent } from './todo-filters-panel.component';

describe('TodoFiltersPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoFiltersPanelComponent],
    }).compileComponents();
  });

  it('should emit "all" when filter button is clicked', () => {
    const fixture = TestBed.createComponent(TodoFiltersPanelComponent);
    const component = fixture.componentInstance;
    let emittedFilter: string | null | undefined;

    const searchControl = new FormControl('');
    fixture.componentRef.setInput('searchControl', searchControl);
    fixture.componentRef.setInput('selectedFilter', 'all');
    component.filterChanged.subscribe((filter) => {
      emittedFilter = filter;
    });
    fixture.detectChanges();

    const toggleGroup = fixture.debugElement.query(By.css('mat-button-toggle-group'));
    toggleGroup.triggerEventHandler('change', { value: 'all' });

    expect(emittedFilter).toBe('all');
  });

  it('should emit "active" when active filter button is clicked', () => {
    const fixture = TestBed.createComponent(TodoFiltersPanelComponent);
    const component = fixture.componentInstance;
    let emittedFilter: string | null | undefined;

    const searchControl = new FormControl('');
    fixture.componentRef.setInput('searchControl', searchControl);
    fixture.componentRef.setInput('selectedFilter', 'active');
    component.filterChanged.subscribe((filter) => {
      emittedFilter = filter;
    });
    fixture.detectChanges();

    const toggleGroup = fixture.debugElement.query(By.css('mat-button-toggle-group'));
    toggleGroup.triggerEventHandler('change', { value: 'active' });

    expect(emittedFilter).toBe('active');
  });

  it('should emit "completed" when completed filter button is clicked', () => {
    const fixture = TestBed.createComponent(TodoFiltersPanelComponent);
    const component = fixture.componentInstance;
    let emittedFilter: string | null | undefined;

    const searchControl = new FormControl('');
    fixture.componentRef.setInput('searchControl', searchControl);
    fixture.componentRef.setInput('selectedFilter', 'completed');
    component.filterChanged.subscribe((filter) => {
      emittedFilter = filter;
    });
    fixture.detectChanges();

    const toggleGroup = fixture.debugElement.query(By.css('mat-button-toggle-group'));
    toggleGroup.triggerEventHandler('change', { value: 'completed' });

    expect(emittedFilter).toBe('completed');
  });
});
