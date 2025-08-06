import {
  AfterViewInit,
  Component,
  EventEmitter,
  input,
  Output,
  ViewChild,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DialogModule } from 'carbon-components-angular';
import { filter } from 'rxjs';
import { UiIconComponent } from '../../../components/icon/icon.component';

@Component({
  selector: 'ui-platform-overflow-menu',
  imports: [DialogModule, UiIconComponent],
  template: `
    <cds-overflow-menu
      #menu
      [open]="isMenuOpen"
      [placement]="placement()"
      [flip]="flip()"
      [offset]="offset()"
      [customTrigger]="customTriggerTemplate"
      (selected)="onMenuSelect($event)"
      (closed)="hardClose()"
      description=""
    >
      @for (option of menuOptions(); track option.id) {
        <cds-overflow-menu-option (selected)="handleOptionSelect(option)">
          {{ option.label }}
        </cds-overflow-menu-option>
      }
    </cds-overflow-menu>

    <ng-template #customTriggerTemplate>
      <!-- wrapper adds the padding -->
      <div class="p-[9px] flex items-center justify-center">
        <ui-icon
          [name]="icon()"
          [size]="iconSize()"
          [color]="iconColor()"
          [fixedWidth]="true"
        ></ui-icon>
      </div>
    </ng-template>
  `,
})
export class UiPlatformOverflowMenuComponent implements AfterViewInit {
  /* ------------- existing @inputs / @outputs ------------------ */
  readonly menuOptions = input<{ id: string; label: string }[]>([]);
  readonly placement = input<'bottom' | 'top'>('bottom');
  readonly flip = input<boolean>(true);
  readonly offset = input<{ x: number; y: number }>({ x: 20, y: 0 });
  readonly icon = input<string>('');
  readonly iconSize = input<string>('1rem');
  readonly iconColor = input<string>('white');
  @Output() menuOptionSelected = new EventEmitter<string>();

  /* ------------------------------------------------------------- */
  isMenuOpen = false;

  @ViewChild('menu', { static: true })
  private menuEl!: HTMLElement & { open: boolean };
  constructor(private router: Router) {}

  /* close the popover on every navigation ----------------------- */
  ngAfterViewInit(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => this.hardClose());
  }

  /* ------------------------------------------------------------- */
  protected hardClose(): void {
    this.isMenuOpen = false;
    if (this.menuEl) this.menuEl.open = false;
  }

  /* unchanged click helpers ------------------------------------- */
  handleOptionSelect(opt: { id: string }) {
    this.hardClose();
    this.onOptionClick(opt.id);
  }

  onMenuSelect(_: any) {
    this.hardClose();
  }

  onOptionClick(id: string) {
    if (id === 'logout') {
      console.log('Logging out…');
    } else {
      this.router.navigate([id]);
    }
    this.menuOptionSelected.emit(id);
  }
}
