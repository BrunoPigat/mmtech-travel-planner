import React from 'react';
import DestinationItem from './DestinationItem';
import {TravelDestination} from "../../types/TravelDestination";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlane} from "@fortawesome/free-solid-svg-icons";

interface DestinationListProps {
    loading: boolean;
    destinations: TravelDestination[];
    onDelete: (destination: TravelDestination) => void;
    changeIndex: (id: string, isForward: boolean) => void;
    onGoTo: (coordinates: [number, number]) => void;
}

const DestinationList: React.FC<DestinationListProps> = ({loading, destinations, changeIndex, onGoTo, onDelete}) => {
    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{height: '200px'}}>
                <div className='spinner-border text-primary text-center'>
                    <FontAwesomeIcon icon={faPlane} size="lg"/>
                </div>
            </div>
        );
    }

    return (
        <div className="row">
            {destinations.length === 0 ? (
                <p>Nenhum destino cadastrado para a viagem atual.</p>
            ) : (
                destinations.map((destination, index) => (
                    <DestinationItem
                        key={destination._id}
                        destination={destination}
                        index={index}
                        destinationsLength={destinations.length}
                        changeIndex={changeIndex}
                        onGoTo={onGoTo}
                        onDelete={onDelete}
                    />
                ))
            )}
        </div>
    );
};

export default DestinationList;
