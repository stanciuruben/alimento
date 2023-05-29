import { useRef, type FC, useEffect } from 'react';
import './ErrorModal.css';

const ErrorModal: FC<{
    title: string
    text: string
    children: JSX.Element | null
}> = ({
    title,
    text,
    children
}) => {
        const modal = useRef<HTMLDialogElement>(null);

        useEffect(() => {
            const currentElement = modal.current;
            currentElement?.close();
            currentElement?.showModal();

            return () => {
                currentElement?.close();
            }
        });

        return (
            <dialog
                ref={modal}
                role='alertdialog'
                className='error-modal border-0'
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-danger">
                            {title}
                        </h5>
                    </div>
                    <div className="modal-body">
                        <p>
                            {text}
                        </p>
                        {children}
                    </div>
                </div>
            </dialog>
        );
    }

export default ErrorModal;
