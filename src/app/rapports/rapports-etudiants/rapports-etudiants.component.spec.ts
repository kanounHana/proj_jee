import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportsEtudiantsComponent } from './rapports-etudiants.component';

describe('RapportsEtudiantsComponent', () => {
  let component: RapportsEtudiantsComponent;
  let fixture: ComponentFixture<RapportsEtudiantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RapportsEtudiantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportsEtudiantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
