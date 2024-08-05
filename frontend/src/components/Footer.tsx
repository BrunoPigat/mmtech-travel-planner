import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-5 bg-white text-dark py-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h5>Travel Planner</h5>
                        <p>&copy; {new Date().getFullYear()} Travel Planner. All rights reserved.</p>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <ul className="list-unstyled">
                            <li><a href="/home" className="text-light">Home</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
