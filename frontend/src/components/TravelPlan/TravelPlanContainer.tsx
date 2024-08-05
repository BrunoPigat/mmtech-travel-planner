import React from 'react';
import {TravelPlan} from '../../types/TravelPlan';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPenClip, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from "react-router-dom";

interface TravelPlanContainerProps {
    travelPlan: TravelPlan;
    onDelete: (id: string) => void;
}

const TravelPlanContainer: React.FC<TravelPlanContainerProps> = ({travelPlan, onDelete}) => {
    const navigate = useNavigate();

    const handleCreateDestination = () => {
        navigate(`/travel-plan/${travelPlan._id}`);
    };

    const handleDeletePlan = () => {
        onDelete(travelPlan._id);
    };

    return (
        <div className="container">
            <div key={travelPlan._id} className="p-4 rounded-4 bg-light mb-3">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 text-center card-title">{travelPlan.title}</h5>
                        <button
                            className="btn btn-light text-danger"
                            onClick={handleDeletePlan}
                            aria-label="Delete Travel Plan"
                        >
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    </div>
                    <div className='my-2 d-flex align-items-center justify-content-start'>
                        <div className='p-1 me-1 rounded-5 bg-secondary-subtle text-center'>
                            {travelPlan.start_date}
                        </div>
                        <div className='p-1 rounded-5 bg-secondary-subtle text-center'>
                            {travelPlan.end_date}
                        </div>
                    </div>
                    <div className='my-2 d-flex align-items-center justify-content-start'>
                        <div className='p-1 me-1 rounded-5 bg-secondary-subtle text-center'>
                            {travelPlan.total_travel_time.toFixed(2)}min
                        </div>
                        <div className='p-1 rounded-5 bg-secondary-subtle text-center'>
                            {travelPlan.total_distance.toFixed(2)}km
                        </div>
                    </div>
                    <hr/>
                    {travelPlan.destinations.length > 0 && (
                        <div>
                            {travelPlan.destinations.map(destination => (
                                <div key={destination._id} className='p-2 mb-1 rounded-5 bg-warning-subtle text-center'>
                                    <strong>{destination.title}</strong>
                                    <br/>
                                </div>
                            ))}
                            <hr/>
                        </div>
                    )}

                    <p className="text-center">Visualizar/Editar</p>
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn rounded-5 bg-dark-subtle"
                            onClick={handleCreateDestination}
                            aria-label="Adicionar Destino"
                        >
                            <FontAwesomeIcon icon={faPenClip}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelPlanContainer;
