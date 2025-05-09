import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportDeleteComponent } from './rapport-delete.component';

describe('RapportDeleteComponent', () => {
  let component: RapportDeleteComponent;
  let fixture: ComponentFixture<RapportDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RapportDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
