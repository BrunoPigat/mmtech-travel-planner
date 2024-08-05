import React from 'react';

interface ConfirmModalProps {
    show: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ show, onConfirm, onCancel, message }) => {
    if (!show) {
        return null;
    }

    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show" style={{ display: 'block' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="border-0 modal-content p-4 rounded-4">
                        <div className="modal-header">
                            <h5 className="modal-title text-danger">Atenção</h5>
                            <button type="button" className="btn-close" onClick={onCancel} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>{message}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="w-50 btn btn-danger" onClick={onCancel}>Não</button>
                            <button type="button" className="w-25 btn btn-success" onClick={onConfirm}>Sim</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmModal;
