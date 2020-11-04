import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HouseholdPage } from './household.page';

describe('HouseholdPage', () => {
  let component: HouseholdPage;
  let fixture: ComponentFixture<HouseholdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseholdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HouseholdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
