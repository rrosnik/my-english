import React, { ForwardedRef, LegacyRef, Ref, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap';
import AddEnglishCardForm from '../../organisms/forms/AddEnglishCardForm';

import "./index.scss";

const UpdateCardAsModal = React.forwardRef((props: any, mainRef: ForwardedRef<HTMLDialogElement>) => {
    const [show, setShow] = useState<boolean>(props.show);
    const ref = useRef<HTMLDialogElement | null>(null);
    const { setName, updatingItem } = props;
    const handleClose = () => {
        setShow(false);
        props.onClose?.();
    }
    const handleShow = () => {
        setShow(true);
        props.onShow?.()
    }


    return (
        <dialog ref={mainRef} onClick={(e: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
            if (mainRef && 'DIALOG' === (e.target as HTMLBaseElement).tagName) {
                (mainRef as React.MutableRefObject<HTMLDialogElement | null>).current?.close();
            }
        }}>
            < div className='dialog-body' >
                <AddEnglishCardForm
                    setName={setName}
                    updatingItem={updatingItem}
                    update={() => {
                        props.onUpdate?.();
                        if (mainRef) {
                            (mainRef as React.MutableRefObject<HTMLDialogElement | null>).current?.close();
                        };
                    }}
                    onClose={() => {
                        if (mainRef) {
                            (mainRef as React.MutableRefObject<HTMLDialogElement | null>).current?.close();
                        }
                    }} />
            </div >
        </dialog >
    )
});

export default UpdateCardAsModal;