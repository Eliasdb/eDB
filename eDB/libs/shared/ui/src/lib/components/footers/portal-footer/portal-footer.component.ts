import { Component } from '@angular/core';

@Component({
  selector: 'ui-portal-footer',
  template: `
    <footer class="bg-black text-white h-12 mt-auto flex justify-center">
      <div class="flex justify-around items-center max-w-[1200px] w-full px-4">
        <p class="m-0 text-[14px] font-normal">
          Powered by
          <a
            href="https://eliasdebock.com"
            target="_blank"
            class="no-underline text-white transition-colors duration-300 hover:text-[#f9ecec]"
          >
            eliasdebock.com
          </a>
        </p>
      </div>
    </footer>
  `,
})
export class UiPortalFooterComponent {}
