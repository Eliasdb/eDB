// login-page-container.component.ts (Platform app)
import { Component } from '@angular/core';
import { PlatformHeaderComponent } from '../../components/header/header.container';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [PlatformHeaderComponent],
  template: `
    <app-platform-header></app-platform-header>
    <div class="page-content">
      <div class="login-section">
        <!-- Add the login form component here -->
      </div>

      <div class="intro-image-section">
        <img
          src="https://www.ibm.com/account/ibmidutil/login-ui/img/illustration-final.svg"
          alt=""
        />
      </div>
    </div>
  `,
  styleUrls: ['./login.container.scss'],
})
export class LoginContainer {
  // Custom logic for the login page container, if needed
}
