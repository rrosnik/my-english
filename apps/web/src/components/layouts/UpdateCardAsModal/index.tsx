import React, { ForwardedRef } from 'react';
import AddEnglishCardForm from '../../organisms/forms/AddEnglishCardForm';

import './index.scss';
import { EnglishCard } from '@my-english/types';

type UpdateCardAsModalProps = {
  setName: (name: string) => void;
  updatingItem?: EnglishCard; // Define a more specific type if possible
  onUpdate?: () => void;
};

const UpdateCardAsModal = React.forwardRef((props: UpdateCardAsModalProps, mainRef: ForwardedRef<HTMLDialogElement>) => {
  const { updatingItem } = props;

  return (
    <dialog
      ref={mainRef}
      onClick={(e: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
        if (mainRef && 'DIALOG' === (e.target as HTMLBaseElement).tagName) {
          (mainRef as React.MutableRefObject<HTMLDialogElement | null>).current?.close();
        }
      }}
    >
      <div className="dialog-body">
        <AddEnglishCardForm
          setName={''}
          updatingItem={updatingItem}
          update={() => {
            props.onUpdate?.();
            if (mainRef) {
              (mainRef as React.MutableRefObject<HTMLDialogElement | null>).current?.close();
            }
          }}
          onClose={() => {
            if (mainRef) {
              (mainRef as React.MutableRefObject<HTMLDialogElement | null>).current?.close();
            }
          }}
        />
      </div>
    </dialog>
  );
});

UpdateCardAsModal.displayName = 'UpdateCardAsModal';

export default UpdateCardAsModal;
