import { MatDialogRef } from '@angular/material/dialog';
import { ModalUsuarioComponent } from './modal-usuario.component';

describe('ModalUsuarioComponent phone validation', () => {
  let dialog: jasmine.SpyObj<MatDialogRef<ModalUsuarioComponent>>;

  beforeEach(() => {
    dialog = jasmine.createSpyObj('MatDialogRef', ['close']);
  });

  it('requires a valid DDD and normalizes a new user phone', () => {
    const modal = new ModalUsuarioComponent(dialog, {});
    modal.salvar();
    expect(dialog.close).not.toHaveBeenCalled();
    expect(modal.phoneError).toContain('DDD');

    modal.telefone = '(11) 99999-9999';
    modal.salvar();
    expect(dialog.close).toHaveBeenCalledWith(jasmine.objectContaining({ telefone: '11999999999' }));
  });

  it('rejects a duplicate even when formatting differs', () => {
    const modal = new ModalUsuarioComponent(dialog, {
      telefonesExistentes: [{ id: 12, telefone: '11999999999' }],
    });
    modal.telefone = '+55 (11) 99999-9999';
    modal.salvar();
    expect(dialog.close).not.toHaveBeenCalled();
    expect(modal.phoneError).toContain('em uso');
  });

  it('allows a legacy user without phone to edit, but checks newly entered values', () => {
    const modal = new ModalUsuarioComponent(dialog, {
      editMode: true,
      usuario: { id: 4, telefone: null },
    });
    modal.update();
    expect(dialog.close).toHaveBeenCalledWith(jasmine.objectContaining({ telefone: null }));

    dialog.close.calls.reset();
    modal.telefone = 'abc';
    modal.update();
    expect(dialog.close).not.toHaveBeenCalled();
    expect(modal.phoneError).toContain('DDD');
  });
});
