import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlane} from "@fortawesome/free-solid-svg-icons";

interface DestinationFormProps {
    loading: boolean;
    error: string | null;
    destinations: Array<any>;
    distanceToPrevious: number;
    handleAddDestination: (e: React.FormEvent<HTMLFormElement>) => void;
    title: string;
    setTitle: (title: string) => void;
}

const DestinationForm: React.FC<DestinationFormProps> = ({
     loading,
     error,
     destinations,
     distanceToPrevious,
     handleAddDestination,
     title,
     setTitle,
 }) => {
    return (
        <div className='p-4 rounded-5 bg-body-secondary'>
            <h1>Novo Destino</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            {loading && (
                <div className='d-flex justify-content-center align-items-center' style={{height: '50px'}}>
                    <div className='spinner-border text-primary text-center'>
                        <FontAwesomeIcon icon={faPlane} size="lg"/>
                    </div>
                </div>
            )}

            {!loading && destinations.length > 0 && distanceToPrevious > 0 && (
                <div className='p-2 mb-2 rounded-5 bg-secondary-subtle'>
                    <p className='mb-0'><b>Distância</b> para o
                        <b> destino {destinations.length}</b> - {distanceToPrevious.toFixed(2)}km</p>
                </div>
            )}
            <form onSubmit={handleAddDestination}>
                <div className="mb-3">
                    <label htmlFor="destinationTitle"
                           className="p-2 form-label rounded-4 bg-secondary-subtle">Nome do Destino</label>
                    <input
                        type="text"
                        className={`form-control ${!title ? 'border-danger' : ''}`}
                        id="destinationTitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <button type="submit" className="w-100 btn btn-primary">Salvar Destino</button>
            </form>
        </div>
    );
};

export default DestinationForm;
