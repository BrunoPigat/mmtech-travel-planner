import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {TravelDestination} from "../types/TravelDestination";
import {
    createTravelPlanDestination,
    deleteTravelPlanDestination,
    getTravelPlan,
    updateDestinationIndex,
} from "../services/travelPlans";

// @ts-ignore
import ConfirmModal from "../components/Modal/ConfirmModal";
import {Coordinates} from "../types/geo";
import {getTravelTime} from "../services/route";
import {TravelPlan} from "../types/TravelPlan";
import MapComponent from "../components/Map";
import TravelPlanHeader from "../components/TravelPlan/TravelPlanHeader";
import DestinationList from "../components/Destination/DestinationList";
import DestinationForm from "../components/Destination/DestinationForm";

const TravelPlanShow: React.FC = () => {
    const {id} = useParams<{ id: string }>();

    const [loading, setLoading] = useState<boolean>(false);
    const [calculatingDistance, setCalculatingDistance] = useState<boolean>(false);

    const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
    const [destinations, setDestinations] = useState<TravelDestination[]>([]);
    const [destinationToDelete, setDestinationToDelete] = useState<TravelDestination | null>(null);

    const [title, setTitle] = useState('');
    const [distanceToPrevious, setDistanceToPrevious] = useState<number>(0);
    const [travelTimeToPrevious, setTravelTimeToPrevious] = useState<number>(0);
    const [lat, setLat] = useState<string>('');
    const [lng, setLng] = useState<string>('');
    const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);

    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    setMapCenter([latitude, longitude]);
                },
                (error) => {
                    console.error('Error getting user location', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    return;
                }

                await loadTravelData();
            } catch (e) {
                setError('Erro ao carregar destinos');
            }
        };

        fetchData();
    }, [id]);

    const loadTravelData = async () => {
        if (!id) {
            return;
        }

        try {
            const {data} = await getTravelPlan(id);
            setTravelPlan(data);
            setDestinations(data.destinations);
        } catch (e) {
            console.log(e);
        }
    };

    const handleAddDestination = useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault();

            if (!id) {
                return;
            }

            if (!title || !lat || !lng) {
                setError('Preencha todos os campos');
                return;
            }

            try {
                setLoading(true);
                await createTravelPlanDestination({
                    title,
                    index: destinations.length,
                    distance_to_previous_destination: distanceToPrevious,
                    travel_time_to_previous_destination: travelTimeToPrevious,
                    travel_plan_id: id,
                    lat,
                    lng
                });

                setTitle('');
                setDistanceToPrevious(0);
                setTravelTimeToPrevious(0);
                setLat('');
                setLng('');
                setMarkerPosition(null);
                setError('');

                await loadTravelData();
            } catch (e) {
                setError('Erro ao adicionar destino');
            } finally {
                setLoading(false);
            }
        },
        [id, loadTravelData]
    );

    const handleConfirmDeleteDestination = (destination: TravelDestination) => {
        setDestinationToDelete(destination);
        setShowConfirmModal(true);
    };

    const handleDeleteDestination = useCallback(async () => {
        if (!destinationToDelete) {
            return;
        }

        try {
            setLoading(true);
            await deleteTravelPlanDestination(destinationToDelete._id);
            setDestinationToDelete(null);
            setShowConfirmModal(false);
            await loadTravelData();
        } catch (e) {
            setError('Erro ao deletar destino');
        } finally {
            setLoading(false);
        }
    }, [loadTravelData]);

    const handleCancelDeleteDestination = () => {
        setDestinationToDelete(null);
        setShowConfirmModal(false);
    };

    const calculateTravelTime = async (start: Coordinates, end: Coordinates) => {
        try {
            setCalculatingDistance(true);
            const {data: {distance, duration}} = await getTravelTime(start, end);
            setDistanceToPrevious(distance);
            setTravelTimeToPrevious(duration);
            setError(null);
        } catch (e) {
            setError('Failed to calculate travel time');
        } finally {
            setCalculatingDistance(false);
        }
    };

    const onMapClick = (lat: number, lng: number) => {
        setLat(lat.toFixed(6));
        setLng(lng.toFixed(6));
        setMarkerPosition([lat, lng]);
        setMapCenter([lat, lng]);

        if (destinations.length > 0) {
            const lastDestination = destinations[destinations.length - 1];
            calculateTravelTime(
                {lat: parseFloat(lastDestination.lat), lng: parseFloat(lastDestination.lng)},
                {lat: lat, lng: lng}
            );
        }
    }

    const changeMapCenter = (coordinates: [number, number]) => {
        setMapCenter(coordinates);
    }

    const handleChangeDestinationIndex = useCallback(
        async (id: string, isForward: boolean) => {
            if (!travelPlan) {
                return;
            }

            try {
                setLoading(true);
                await updateDestinationIndex({ id, isForward });
                await loadTravelData();
            } catch (e) {
                setError('Erro ao alterar ordem de destinos');
            } finally {
                setLoading(false);
            }
        },
        [travelPlan, loadTravelData]
    );

    return (
        <div className="container">
            <div className='mt-5'>
                <TravelPlanHeader travelPlan={travelPlan}/>
                <DestinationList
                    destinations={destinations}
                    changeIndex={handleChangeDestinationIndex}
                    loading={loading}
                    onDelete={handleConfirmDeleteDestination}
                    onGoTo={changeMapCenter}
                />
            </div>
            <div className='p-4 my-2 rounded-4 bg-secondary-subtle'>
                <p className='mb-0 text-center'>Para cadastrar um novo destino basta clicar sobre o mapa e nomeá-lo!</p>
            </div>
            <div className='row'>
                <div className='mb-2 col-sm-12 col-md-4'>
                    <DestinationForm loading={calculatingDistance} title={title} setTitle={setTitle} destinations={destinations}
                                     distanceToPrevious={distanceToPrevious} error={error}
                                     handleAddDestination={handleAddDestination}/>
                </div>
                <div className='col-sm-12 col-md-8'>
                    <MapComponent center={mapCenter} onMapClick={onMapClick} destinations={destinations}
                                  markerPosition={markerPosition}/>
                </div>
            </div>

            <ConfirmModal
                show={showConfirmModal}
                onConfirm={handleDeleteDestination}
                onCancel={handleCancelDeleteDestination}
                message={`Tem certeza que deseja deletar o destino ${destinationToDelete?.title}?`}
            />
        </div>
    );
};

export default TravelPlanShow;
