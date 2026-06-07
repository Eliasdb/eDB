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
    template?: TemplateRef<unknown>;
    context?: unknown;
    onSave?: () => boolean | void;
    onClose?: () => void;
  }) {
    const modalRef = this.modalService.create<UiModalComponent>({
      component: UiModalComponent,
    });

    modalRef.setInput('header', options.header);
    modalRef.setInput('content', options.content);
    modalRef.setInput('template', options.template ?? null);
    modalRef.setInput('context', options.context ?? null);
    modalRef.changeDetectorRef.detectChanges();

    modalRef.instance.save.subscribe(() => {
      const shouldClose = options.onSave?.();
      if (shouldClose === false) return;
      modalRef.destroy();
    });

    modalRef.instance.dismissed.subscribe(() => {
      options.onClose?.();
      modalRef.destroy();
    });
  }
}
