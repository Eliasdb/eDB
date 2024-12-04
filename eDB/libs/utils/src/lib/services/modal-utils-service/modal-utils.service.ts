import { Injectable, inject } from '@angular/core';
import { UiModalComponent } from '@eDB/shared-ui';
import { ModalService } from 'carbon-components-angular';

@Injectable({
  providedIn: 'root',
})
export class ModalUtilsService {
  private modalService = inject(ModalService);

  openModal(options: {
    header: string;
    content?: string;
    hasForm?: boolean;
    formData?: any;
    onSave?: (formData?: any) => void;
    onClose?: () => void;
  }) {
    const modalRef = this.modalService.create<UiModalComponent>({
      component: UiModalComponent,
    });

    modalRef.instance.header = options.header;

    if (options.content) {
      modalRef.instance.content = options.content;
    }

    if (options.hasForm || options.formData) {
      modalRef.instance.hasForm = true;
      modalRef.instance.form.patchValue(options.formData);
    }

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
