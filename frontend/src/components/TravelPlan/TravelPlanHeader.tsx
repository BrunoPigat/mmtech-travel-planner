import React from 'react';
import {TravelPlan} from "../../types/TravelPlan";

interface TravelPlanHeaderProps {
    travelPlan: TravelPlan | null;
}

const TravelPlanHeader: React.FC<TravelPlanHeaderProps> = ({ travelPlan }) => {
    const hasTotals = travelPlan?.total_distance != null && travelPlan?.total_travel_time != null;

    return (
        <div className='col-sm-12'>
            <h2>Destinos de {travelPlan?.title}</h2>
            {hasTotals && (
                <div>
                    <div className='d-flex'>
                        <div className='p-3 rounded-5 bg-secondary-subtle'>
                            Distância Total: <b>{(travelPlan.total_distance).toFixed(2)}km</b>
                        </div>
                        <div className='p-3 ms-2 rounded-5 bg-secondary-subtle'>
                            Tempo de Viagem: <b>{travelPlan.total_travel_time.toFixed(0)}min</b>
                        </div>
                    </div>
                </div>
            )}
            <hr />
        </div>
    );
};

export default TravelPlanHeader;
