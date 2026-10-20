import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from './Dialog.jsx';
import { Button } from './Button.jsx';
import { Checkbox } from './Checkbox.jsx';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  destructive = false,
  acknowledgement,
  children,
  confirmDisabled = false,
}) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="sm">
      {isOpen ? (
        <ConfirmFields
          title={title}
          description={description}
          confirmLabel={confirmLabel}
          destructive={destructive}
          acknowledgement={acknowledgement}
          confirmDisabled={confirmDisabled}
          onClose={onClose}
          onConfirm={onConfirm}
        >
          {children}
        </ConfirmFields>
      ) : null}
    </Dialog>
  );
}

function ConfirmFields({
  title,
  description,
  confirmLabel,
  destructive,
  acknowledgement,
  children,
  confirmDisabled,
  onClose,
  onConfirm,
}) {
  const [ack, setAck] = useState(false);
  const blocked = confirmDisabled || (Boolean(acknowledgement) && !ack);

  return (
    <>
      <DialogHeader>{title}</DialogHeader>
      <DialogContent>
        <div className="space-y-4 text-sm text-neutral-text-muted">
          <div>{description}</div>
          {children}
          {acknowledgement && <Checkbox label={acknowledgement} checked={ack} onChange={(e) => setAck(e.target.checked)} />}
        </div>
      </DialogContent>
      <DialogFooter>
        <div className="flex w-full justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'primary'}
            disabled={blocked}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}
