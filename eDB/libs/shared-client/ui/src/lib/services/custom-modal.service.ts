import { Injectable, TemplateRef, inject } from '@angular/core';
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
    template?: TemplateRef<any>;
    context?: any;
    onSave?: () => void;
    onClose?: () => void;
  }) {
    const modalRef = this.modalService.create<UiModalComponent>({
      component: UiModalComponent,
    });

    if (options.header) modalRef.instance.header.set(options.header);
    if (options.content) modalRef.instance.content.set(options.content);
    if (options.template) modalRef.instance.template.set(options.template);
    if (options.context) modalRef.instance.context.set(options.context);

    modalRef.instance.save.subscribe(() => {
      options.onSave?.();
      modalRef.destroy();
    });

    modalRef.instance.close.subscribe(() => {
      options.onClose?.();
      modalRef.destroy();
    });
  }
}
