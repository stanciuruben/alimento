import { useRef, type FC, useEffect } from 'react';
import './LoadingModal.css';

const LoadingModal: FC = () => {
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
            className='loading-modal border-0'
            role='alertdialog'
        >
            <div className="modal-content user-select-none pe-none">
                <div className="modal-header">
                    <h5 className="modal-title">
                        Generating...
                    </h5>
                </div>
                <div className="modal-body flex flex-col justify-content-center align-items-center text-center">
                    <iframe
                        src="https://giphy.com/embed/l2JHRhAtnJSDNJ2py"
                        width="100%"
                        height="100%"
                        style={{
                            position: 'relative',
                            width: '15rem',
                            height: '15rem',
                            userSelect: 'none',
                            pointerEvents: 'none'
                        }}
                        frameBorder="0"
                        className="giphy-embed user-select-none pe-none"
                        allowFullScreen
                    ></iframe>
                    <p className='mt-5'>
                        Please wait while we generate a meal plan for your choices!
                    </p>
                </div>
            </div>
        </dialog>
    );
}

export default LoadingModal;
