import { Component } from '@angular/core';

@Component({
  selector: 'ui-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-links">
          <a href="/contact" class="footer-link">Contact</a>
          <span class="footer-divider">|</span>
          <a href="/privacy" class="footer-link">Privacy</a>
        </div>
        <p>
          Powered by
          <a href="https://eliasdebock.com" target="_blank">eliasdebock.com</a>
        </p>
      </div>
    </footer>
  `,
  styleUrls: ['footer.component.scss'],
})
export class UiFooterComponent {}
