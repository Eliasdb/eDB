import { ComponentRef, Injectable, inject } from '@angular/core';
import { ModalService } from 'carbon-components-angular';
import { UiModalComponent } from '../components/modal/modal.component';

@Injectable({
  providedIn: 'root',
})
export class CustomModalService {
  private modalService = inject(ModalService);

  openModal(options: {
    header?: string;
    content?: string;
    hasForm?: boolean;
    formData?: any;
    onSave?: (formData?: any) => void;
    onClose?: () => void;
  }) {
    const modalRef: ComponentRef<UiModalComponent> =
      this.modalService.create<UiModalComponent>({
        component: UiModalComponent,
      });

    if (options.content) modalRef.instance.content.set(options.content);

    if (options.header) {
      modalRef.instance.header.set(options.header);
    }

    if (options.hasForm || options.formData) {
      modalRef.instance.hasForm.set(true);
      modalRef.instance.form.patchValue(options.formData);
    }

    // Subscribe to signals
    modalRef.instance.save.subscribe((formData: any) => {
      options.onSave?.(formData);
      modalRef.destroy();
    });

    modalRef.instance.close.subscribe(() => {
      options.onClose?.();
      modalRef.destroy();
    });
  }
}
