import React, {useEffect, useState} from 'react';
import {TravelPlan} from "../../types/TravelPlan";
import {deleteTravelPlan, getTravelPlans} from "../../services/travelPlans";
import TravelPlanContainer from "./TravelPlanContainer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import CreateTravelPlanModal from "./CreateTravelPlanModal";
import ConfirmModal from "../Modal/ConfirmModal";

const TravelPlanList: React.FC = () => {
    const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [travelPlanToDelete, setTravelPlanToDelete] = useState<TravelPlan | null>(null);
    const [showModal, setShowModal] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        const fetchTravelPlans  = async () => {
            try {
                await loadTravelPlans();
            } catch (err) {
                setError('Error fetching travel plans');
            }
        };

        fetchTravelPlans();
    }, []);

    const loadTravelPlans  = async () => {
        try {
            const {data} = await getTravelPlans();
            setTravelPlans(data);
        } catch (err) {
            setError('Erro ao carregar viagens');
        }
    };

    const handleCreatePlan = () => {
        setShowModal(true);
    };

    const handleCloseCreatePlanModal = () => {
        setShowModal(false);
    };

    const handleConfirmDeletePlan = (travelPlan: TravelPlan) => {
        setTravelPlanToDelete(travelPlan);
        setShowConfirmModal(true);
    };

    const handleDeletePlan = async () => {
        try {
            if(!travelPlanToDelete){
                return
            }

            setShowConfirmModal(false);
            await deleteTravelPlan(travelPlanToDelete._id);
            await loadTravelPlans();
        } catch (e){
            setError('Erro ao deletar viagem');
        }
    };

    const handleCancelDeletePlan = () => {
        setShowConfirmModal(false);
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-start align-items-center mb-3">
                <h1 className='me-4'>Suas Viagens</h1>
                <button
                    className="btn btn-light"
                    onClick={handleCreatePlan}
                    aria-label="Criar Viagem"
                >
                    <FontAwesomeIcon icon={faPlus}/>
                </button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {travelPlans.length === 0 ? (
                <p>Você ainda não planejou nenhuma viagem, clique no + acima para começar!</p>
            ) : (
                <div className='row'>
                    {travelPlans.map(plan => (
                        <div className='col-sm-12 col-md-3' key={`travel-plan-${plan._id}`}>
                            <TravelPlanContainer travelPlan={plan} onDelete={() => handleConfirmDeletePlan(plan)}/>
                        </div>
                    ))}
                </div>
            )}

            <CreateTravelPlanModal
                show={showModal}
                handleClose={handleCloseCreatePlanModal}
                reloadTravelPlans={loadTravelPlans}
            />

            <ConfirmModal
                show={showConfirmModal}
                onConfirm={handleDeletePlan}
                onCancel={handleCancelDeletePlan}
                message={`Tem certeza que deseja deletar sua viagem?`}
            />
        </div>
    );
};

export default TravelPlanList;
