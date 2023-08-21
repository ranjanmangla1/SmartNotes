import { faUser } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { Dropdown, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Profile = () => {
    const [open, setOpen] = useState(false);

    const { currentUser } = useAuth()
    console.log(currentUser.photoURL)
    const avatar = currentUser.photoURL

    const openModal = () => {
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
    };
    
    return (
        // <div onClick={openModal} style={{alignSelf: "stretch", position: "relative"}}>
        // <Dropdown alignRight> <Dropdown.Toggle className=“custom-toggle”> … </Dropdown.Toggle> <Dropdown.Menu> … </Dropdown.Menu> </Dropdown>
            
            <Dropdown  boundary="viewport" popperConfig={{strategy: 'fixed'}}>
                <Dropdown.Toggle className="custom-toggle">
                    {
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
                <Dropdown.Menu>
                <Dropdown.Item href="#">Home Page</Dropdown.Item>
                <Dropdown.Item href="#">Settings</Dropdown.Item>
                <Dropdown.Item href="#">Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        // </div>
    )
}

export default Profile