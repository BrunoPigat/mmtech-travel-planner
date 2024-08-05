import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {WeatherApiResponse, WeatherData} from "../../types/weather";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCloud} from "@fortawesome/free-solid-svg-icons";

interface WeatherInfoProps {
    title: string;
    lat: number;
    lng: number;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({title, lat, lng}) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const {data} = await axios.get<WeatherApiResponse>(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
                );

                const weatherData = data.current_weather;

                const weatherDescription = getWeatherDescription(weatherData.weathercode);

                setWeather({
                    temperature: weatherData.temperature,
                    weatherCode: weatherData.weathercode,
                    weatherDescription: weatherDescription
                });
            } catch (error) {
                setError('Erro ao carregar informações climáticas');
                console.error(error);
            }
        };

        fetchWeather();
    }, [lat, lng]);

    const getWeatherDescription = (weatherCode: number): string => {
        const weatherDescriptions: { [key: number]: string } = {
            0: 'Céu Limpo',
            1: 'Parcialmente Limpo',
            2: 'Parcialmente Nublado',
            3: 'Nublado',
        };

        return weatherDescriptions[weatherCode] || 'Unknown weather';
    };

    const getBackgroundClass = (weatherCode: number): string => {
        switch (weatherCode) {
            case 0:
                return 'bg-warning-subtle';
            case 1:
                return 'bg-primary-subtle';
            case 2:
                return 'bg-body-secondary';
            case 3:
                return 'bg-dark-subtle';
            default:
                return 'bg-light';
        }
    };

    return (
        <div className="p-4">
            <div className="card-body">
                {error && <p className="text-danger">{error}</p>}
                {weather ? (
                    <div className={`p-3 rounded-5 ${weather ? getBackgroundClass(weather.weatherCode) : 'bg-light'}`}>
                        <div className='d-flex justify-content-between'>
                            <h3>{title}</h3>
                            <h2 className='mb-0 text-right'>{weather?.temperature}°C</h2>
                        </div>
                            <p className='mb-0 text-right'>{weather?.weatherDescription}</p>
                    </div>
                ) : (
                    <div className='d-flex justify-content-center align-items-center' style={{height: '50px'}}>
                        <div className='spinner-border text-primary text-center'>
                            <FontAwesomeIcon icon={faCloud} size="lg"/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherInfo;
