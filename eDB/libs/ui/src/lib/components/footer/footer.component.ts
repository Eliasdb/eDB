import { Component } from '@angular/core';

@Component({
  selector: 'ui-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
        <p>Powered by eliasdebock.com</p>
      </div>
    </footer>
  `,
  styleUrls: ['footer.component.scss'],
})
export class FooterComponent {}
