import { faUser } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Dropdown, Toast, ToastBody } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [isOpen, setIsOpen] = useState(false);
    // const dropdownRef = useRef(null);
    const { currentUser, logOut } = useAuth();
    const avatar = currentUser.photoURL;
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    function handleLogout(e) {
        // e.preventDefaults();
        try {
        logOut();
        navigate("/login");
        } catch(error) {
            <Toast>
                <ToastBody>
                    Unable to logout!
                </ToastBody>
            </Toast>
        }
    }

    // const handleClickOutside = (event) => {
    //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    //         closeDropdown();
    //     }
    // };

    // useEffect(() => {
    //     window.addEventListener('click', handleClickOutside);
    //     return () => {
    //         window.removeEventListener('click', handleClickOutside);
    //     };
    // }, []);

    return (
        <Dropdown
            show={isOpen}
            onClick={(e) => e.stopPropagation()}
        >
            <Dropdown.Toggle
                className="custom-toggle"
                onClick={toggleDropdown}
            >
                {
                    // avatar ? (
                    //     <img
                    //         alt="avatar"
                    //         src={currentUser.photoURL}
                    //         className="profile-avatar"
                    //     />
                    // ) : (
                    //     <FontAwesomeIcon
                    //         icon={faUser}
                    //         className="profile-icon"
                    //     />
                    // )
                    avatar
                        ? <img alt='avatar' 
                            style={{ 
                                width: "3rem", 
                                height: "79px", 
                                alignSelf: "center" 
                            }}
                            src={currentUser.photoURL} 
                            className='w-100'
                        />
                        :  <FontAwesomeIcon icon={faUser} 
                            style={{ 
                                border: "1px solid black",
                                borderRadius: "100%", 
                                padding: "7px", 
                                textAlign: "center"
                            }}
                        />
                }
            </Dropdown.Toggle>
            <Dropdown.Menu
                show={isOpen}
                align="end"
                // ref={dropdownRef}
                // variant='dark'
                style={{ padding: "0", margin: "0", zIndex: "1000", marginTop: "3px", backgroundColor: "#f5f5f5"}}
            >
                <Dropdown.Item className="custom-dropdown-item" href="/" >Home Page</Dropdown.Item>
                <Dropdown.Item className="custom-dropdown-item" href="/update-profile" >Settings</Dropdown.Item>
                <Dropdown.Item className="custom-dropdown-item" onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default Profile;
