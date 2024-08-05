import React from 'react';
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
