import { Component } from '@angular/core';
import { UiFooterComponent, UiHeaderComponent } from '@e-db/ui';
import { LoginFormComponent } from '../../../components/portal/login/login-form/login-form.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [UiHeaderComponent, UiFooterComponent, LoginFormComponent],
  template: `
    <section class="login-container">
      <ui-header></ui-header>
      <div class="page-content">
        <div class="login-section">
          <app-login-form></app-login-form>
        </div>

        <div class="intro-image-section">
          <img
            src="https://www.ibm.com/account/ibmidutil/login-ui/img/illustration-final.svg"
            alt=""
          />
        </div>
      </div>
      <ui-footer></ui-footer>
    </section>
  `,
  styleUrls: ['./login.container.scss'],
})
export class LoginContainer {}
