import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Observable, of } from 'rxjs';
import { LoginComponent } from './login.component';

xdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let serviceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj(
      'AuthService', 
      ['login', 'logout', 'register'], 
      {authUrl: 'http://localhost:8080/auth', loggedIn: false}
    );

    serviceSpy.login.withArgs('testuser@gmail.com', 'password')
      .and
      .returnValue(of(new User(1, 'testuser@gmail.com', 'password', false))
    );

    await TestBed.configureTestingModule({
      imports:[HttpClientModule],
      declarations: [ LoginComponent ],
      providers: [{provide: AuthService, useValue: serviceSpy}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return user info and set user id', () => {
    component.attemptLogin('testuser@gmail.com', 'password');
    expect(localStorage.getItem('current-user')).toEqual('1');
  })
});
