// ui-nz-modal.component.ts  (legacy API)
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, input } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'ui-nz-modal',
  standalone: true,
  imports: [CommonModule, NzModalModule],
  host: { class: 'block' },
  template: `
    <nz-modal
      [nzVisible]="open()"
      [nzTitle]="title()"
      [nzOkText]="okText()"
      [nzCancelText]="cancelText()"
      [nzOkLoading]="okLoading()"
      [nzWidth]="width()"
      [nzClosable]="closable()"
      [nzMaskClosable]="maskClosable()"
      (nzOnOk)="handleOk()"
      (nzOnCancel)="handleCancel()"
      (nzVisibleChange)="handleVisibleChange($event)"
    >
      <ng-content></ng-content>
    </nz-modal>
  `,
})
export class UiNzModalComponent {
  readonly open = input<boolean>(false);
  readonly title = input<string>('');
  readonly okText = input<string>('Confirm');
  readonly cancelText = input<string>('Cancel');
  readonly okLoading = input<boolean>(false);
  readonly width = input<string | number>('480px');
  readonly closable = input<boolean>(true);
  readonly maskClosable = input<boolean>(true);

  @Output() readonly openChange = new EventEmitter<boolean>();
  @Output() readonly ok = new EventEmitter<void>();
  @Output() readonly cancel = new EventEmitter<void>();

  handleOk(): void {
    this.ok.emit();
  }
  handleCancel(): void {
    this.cancel.emit();
  }
  handleVisibleChange(next: boolean): void {
    this.openChange.emit(next);
  }
}
