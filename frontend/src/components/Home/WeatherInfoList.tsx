import React from 'react';
import {weatherLocations} from "../../consts/weather";
import {WeatherLocation} from "../../types/weather";
import WeatherInfo from "./WeatherInfo";

const WeatherInfoList: React.FC = () => {
    return (
        <div className="row rounded-4">
            <div className='col-md-12'>
                <h3>Em dúvida? Dê uma olhada nos destinos em alta!</h3>
            </div>
            {weatherLocations.map((location: WeatherLocation, index: number) => {
                return (
                    <div className='col-md-4' key={index}>
                        <WeatherInfo title={location.title} lat={location.lat} lng={location.lng}/>
                    </div>
                );
            })}
        </div>
    );
};

export default WeatherInfoList;
