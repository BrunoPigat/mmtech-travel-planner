import React, { useState } from 'react';
import { createTravelPlan } from "../../services/travelPlans";

interface CreateTravelPlanModalProps {
    show: boolean;
    handleClose: () => void;
    reloadTravelPlans: () => void;
}

const CreateTravelPlanModal: React.FC<CreateTravelPlanModalProps> = ({ show, handleClose, reloadTravelPlans }) => {
    const [title, setTitle] = useState('Viagem dos Sonhos');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [invalidFields, setInvalidFields] = useState<{ title: boolean; startDate: boolean; endDate: boolean }>({
        title: false,
        startDate: false,
        endDate: false,
    });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Check for empty fields and update invalidFields state
        const titleInvalid = !title.trim();
        const startDateInvalid = !startDate;
        const endDateInvalid = !endDate;

        setInvalidFields({
            title: titleInvalid,
            startDate: startDateInvalid,
            endDate: endDateInvalid,
        });

        if (titleInvalid || startDateInvalid || endDateInvalid) {
            setError('Todos os campos são obrigatórios');
            return;
        }

        try {
            await createTravelPlan({ title, start_date: startDate, end_date: endDate });
            reloadTravelPlans();
            handleClose();
        } catch (err) {
            setError('Erro ao criar viagem');
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (error) setError(null); // Clear error when user starts typing
        if (invalidFields.title) setInvalidFields(prev => ({ ...prev, title: false }));
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        if (error) setError(null); // Clear error when user starts typing
        if (invalidFields.startDate) setInvalidFields(prev => ({ ...prev, startDate: false }));
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
        if (error) setError(null); // Clear error when user starts typing
        if (invalidFields.endDate) setInvalidFields(prev => ({ ...prev, endDate: false }));
    };

    return (
        <>
            {show && <div className="modal-backdrop fade show"></div>}
            <div className={`modal ${show ? 'd-block' : 'd-none'}`} tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="border-0 modal-content p-4 rounded-4">
                        <div className="modal-header">
                            <h5 className="modal-title">Criar Viagem</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="formTitle" className="form-label">Nomeie a Sua Viagem</label>
                                    <input
                                        type="text"
                                        className={`form-control ${invalidFields.title ? 'border border-danger' : ''}`}
                                        id="formTitle"
                                        value={title}
                                        onChange={handleTitleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="formStartDate" className="form-label">Início</label>
                                    <input
                                        type="date"
                                        className={`form-control ${invalidFields.startDate ? 'border border-danger' : ''}`}
                                        id="formStartDate"
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="formEndDate" className="form-label">Fim</label>
                                    <input
                                        type="date"
                                        className={`form-control ${invalidFields.endDate ? 'border border-danger' : ''}`}
                                        id="formEndDate"
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn w-100 btn-primary">Criar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateTravelPlanModal;
