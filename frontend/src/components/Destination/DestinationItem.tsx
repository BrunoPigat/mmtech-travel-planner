import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAlignRight,
    faAngleLeft,
    faAngleRight,
    faEye,
    faRightToBracket,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import {TravelDestination} from '../../types/TravelDestination';

interface DestinationItemProps {
    destination: TravelDestination;
    index: number;
    destinationsLength: number;
    onDelete: (destination: TravelDestination) => void;
    changeIndex: (id: string, isForward: boolean) => void;
    onGoTo: (coordinates: [number, number]) => void;
}

const DestinationItem: React.FC<DestinationItemProps> = ({destination, index, changeIndex, destinationsLength, onGoTo, onDelete}) => {
    return (
        <div className="mb-2 col-sm-6 col-md-3" key={destination._id}>
            <div className='p-1 d-flex align-items-center justify-content-between rounded-4 bg-warning-subtle'>
                <div key={destination._id} className="p-3">
                    <h5 className='mb-0'>Destino {index + 1}</h5>
                    <p>{destination.title}</p>
                    {index > 0 && (
                        <p className='mb-0 me-1'>
                            A {destination.travel_time_to_previous_destination.toFixed(2)} minutos
                            ({destination.distance_to_previous_destination.toFixed(2)}km)
                            do destino anterior
                        </p>
                    )}
                </div>
                <div className='d-grid'>
                    <button
                        className="btn"
                        onClick={() => onGoTo([parseFloat(destination.lat), parseFloat(destination.lng)])}
                        title="Ver Destino"
                        aria-label="Ver Destino"
                    >
                        <FontAwesomeIcon icon={faEye}/>
                    </button>
                    <button
                        className="btn"
                        onClick={() => onDelete(destination)}
                        title="Excluir Destino"
                        aria-label="Excluir Destino"
                    >
                        <FontAwesomeIcon icon={faTrash}/>
                    </button>
                    {index < destinationsLength - 1 && (
                        <button
                            className="btn"
                            onClick={() => changeIndex(destination._id, true)}
                            title="Mandar para frente"
                            aria-label="Mandar para frente"
                        >
                            <FontAwesomeIcon icon={faAngleRight}/>
                        </button>
                    )}
                    {index > 0 && (
                        <button
                            className="btn"
                            onClick={() => changeIndex(destination._id, false)}
                            title="Mandar para trás"
                            aria-label="Mandar para trás"
                        >
                            <FontAwesomeIcon icon={faAngleLeft}/>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DestinationItem;
