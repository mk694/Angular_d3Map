import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial theme', () => {
    expect(component.currentTheme).toEqual(component.themes[0]);
  });

  it('should change theme correctly', () => {
    component.changeTheme(1);
    expect(component.currentTheme).toEqual(component.themes[1]);
    expect(component.themeIndex).toBe(1);
  });

  it('should calculate shipment frequency index correctly', () => {
    const postalCode = '1011';  // Replace with actual postal code present in sample data
    const frequencyIndex = component.shipmentFrequencyIndex(postalCode);
    expect(frequencyIndex).toBeGreaterThanOrEqual(0);
  });

  it('should calculate circle size correctly', () => {
    const postalCode = '1011';  // Replace with actual postal code present in sample data
    const circleSize = component.circleSize(postalCode);
    expect(circleSize).toBeGreaterThan(5);
  });

  it('should calculate circle color correctly', () => {
    const postalCode = '1011';  // Replace with actual postal code present in sample data
    const circleColor = component.circleColor(postalCode);
    expect(circleColor).toBe("rgb(255, 23, 0)");
  });
});
