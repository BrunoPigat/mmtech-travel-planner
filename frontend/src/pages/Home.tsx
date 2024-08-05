import React, { useEffect, useState } from 'react';
import TravelPlanList from "../components/TravelPlan/TravelPlanList";
import HomeHeader from "../components/Home/HomeHeader";

const Home: React.FC = () => {
    return (
        <div className="p-5 h-100">
            <section>
                <HomeHeader/>
            </section>
            <section className='mt-5'>
                <TravelPlanList/>
            </section>
        </div>
    );
};

export default Home;
