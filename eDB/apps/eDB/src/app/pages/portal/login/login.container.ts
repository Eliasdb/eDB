import { Component } from '@angular/core';
import { LoginFormComponent } from '../../../components/portal/login/login-form/login-form.component';

@Component({
  selector: 'platform-login-page',
  standalone: true,
  imports: [LoginFormComponent],
  template: `
    <section class="login-container">
      <div class="page-content">
        <div class="login-section">
          <platform-portal-login-form />
        </div>

        <div class="intro-image-section">
          <img
            src="https://www.ibm.com/account/ibmidutil/login-ui/img/illustration-final.svg"
            alt=""
            height="850"
            width="auto"
          />
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./login.container.scss'],
})
export class LoginContainer {}
