// login-page-container.component.ts (Platform app)
import { Component } from '@angular/core';
import { PlatformFooterComponent } from '../../components/footer/footer.component';
import { PlatformHeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [PlatformHeaderComponent, PlatformFooterComponent],
  template: `
    <section class="login-container">
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
      <app-platform-footer></app-platform-footer>
    </section>
  `,
  styleUrls: ['./login.container.scss'],
})
export class LoginContainer {}
