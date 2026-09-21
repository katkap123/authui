import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateNotificationComponent } from './admin-create-notification.component';

describe('AdminCreateNotificationComponent', () => {
  let component: AdminCreateNotificationComponent;
  let fixture: ComponentFixture<AdminCreateNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
