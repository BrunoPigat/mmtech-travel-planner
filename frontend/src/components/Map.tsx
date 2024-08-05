import React, {useState, useEffect, useMemo} from 'react';
import L from 'leaflet';
import {MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents} from 'react-leaflet';
import {TravelDestination} from '../types/TravelDestination';
import {Coordinates} from '../types/geo';

const createCustomIcon = (index: number) => {
    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: #0b7ccc; color: #ffffff; padding: 5px; border-radius: 50%; text-align: center; width: 30px; height: 30px;">${index}</div>`,
        iconSize: [30, 30],
    });
};

interface MapComponentProps {
    destinations: TravelDestination[];
    markerPosition: [number, number] | null;
    onMapClick: (lat: number, lng: number) => void;
    center: [number, number];
}

const MapCenterUpdater: React.FC<{ center: [number, number] | null }> = ({ center }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);

    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
   destinations,
   markerPosition,
   onMapClick,
   center
}) => {

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                const {lat, lng} = e.latlng;
                onMapClick(lat, lng);
            },
        });
        return null;
    };

    const DestinationsMarkers = useMemo(() => {
        return destinations.map((destination, index) => (
            <Marker
                key={destination._id}
                position={[parseFloat(destination.lat), parseFloat(destination.lng)]}
                icon={createCustomIcon(index + 1)}
            >
                <Popup>{destination.title}</Popup>
            </Marker>
        ));
    }, [destinations]);

    return (
        <MapContainer center={center} zoom={13} style={{height: '400px', width: '100%'}}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapCenterUpdater center={center}/>
            <MapClickHandler/>
            {markerPosition && (
                <Marker position={markerPosition}>
                    <Popup>Próximo Destino</Popup>
                </Marker>
            )}
            {DestinationsMarkers}
        </MapContainer>
    );
};

export default MapComponent;
