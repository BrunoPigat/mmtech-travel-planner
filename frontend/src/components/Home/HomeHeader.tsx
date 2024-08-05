import React, { useEffect, useState } from 'react';
import WeatherInfo from "./WeatherInfo";
import {weatherLocations} from "../../consts/weather";
import {WeatherLocation} from "../../types/weather";
import WeatherInfoList from "./WeatherInfoList";

const HomeHeader: React.FC = () => {
    return (
        <div className="container">
            <WeatherInfoList/>
            <hr/>
        </div>
    );
};

export default HomeHeader;
