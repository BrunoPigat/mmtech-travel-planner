import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlane, faRightToBracket, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {logout} from "../services/auth";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('username');
            navigate('/signin');
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
            <div className="container-fluid">
                <div className="d-flex justify-content-center w-100">
                    <Link className="navbar-brand mx-auto text-dark text-center" to="/home">
                        <FontAwesomeIcon icon={faPlane} size="lg"/>
                        <p className='m-0 p-0'>
                            {username && "Suas "}Viagens
                        </p>
                    </Link>
                </div>
                {username && (
                    <div className="ml-auto">
                        <span className="d-flex align-items-center btn btn-light">
                            <FontAwesomeIcon icon={faUserCircle}/>
                            <p className='mb-0 ms-2'>{username}</p>
                        </span>
                    </div>
                )}
                {username && (
                    <div className="ms-2">
                        <button
                            className="btn btn-light"
                            onClick={handleLogout}
                            title="Sair"
                            aria-label="Sair"
                        >
                            <FontAwesomeIcon icon={faRightToBracket}/>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
