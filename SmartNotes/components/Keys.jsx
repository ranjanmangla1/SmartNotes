import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { db, secretsCollection } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { addDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const PasswordInput = ({ label, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            <div className="input-group">
                <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                />
                <div className="input-group-append">
                    <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </Button>
                </div>
            </div>
        </Form.Group>
    );
};

const Keys = () => {
    const [open, setOpen] = useState(false);
    const [hashnodeSecret, setHashnodeSecret] = useState("");
    const [mediumSecret, setMediumSecret] = useState("");
    const [openAISecret, setOpenAISecret] = useState("");

    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const {currentUser} = useAuth();

    const openModal = () => {
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!currentUser) {
            return; // User is not authenticated
        }
    
        try {
            const userSecretDocRef = doc(secretsCollection, currentUser.uid);
            const userSecretDocSnapshot = await getDoc(userSecretDocRef);
    
            const newSecret = {
                hashnodeSecret: hashnodeSecret,
                mediumSecret: mediumSecret,
                openAISecret: openAISecret,
                user: currentUser.uid
            }
    
            if (userSecretDocSnapshot.exists()) {
                // Document exists, update it
                await updateDoc(userSecretDocRef, newSecret);
            } else {
                // Document doesn't exist, create a new one
                await setDoc(userSecretDocRef, newSecret);
            }
    
            console.log('Secret values saved successfully!');
            closeModal(); // Close the modal after saving
        } catch (error) {
            console.error('Error saving secret values:', error);
        }
    };

    const fetchUserSecrets = async () => {
        if (currentUser) {
            const userSecretDocRef = doc(secretsCollection, currentUser.uid);
            const userSecretDocSnapshot = await getDoc(userSecretDocRef);
            if (userSecretDocSnapshot.exists()) {
                const data = userSecretDocSnapshot.data();
                setHashnodeSecret(data.hashnodeSecret || "");
                setMediumSecret(data.mediumSecret || "");
                setOpenAISecret(data.openAISecret || "");
            }
        }
    };

    useEffect(() => {
        fetchUserSecrets();
    }, [currentUser]);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center', // Align items along the cross axis
                gap: '0',
                margin: '0',
            }}
        >
            {/* <Button 
                onClick={openModal} 
                variant="outline-success" 
                size="sm" 
                style={{ height: "50px" , width: "40px",paddingTop: "2px", margin:"0" ,border: "1px solid black", borderRadius: "4px", color: `${isHovered ? 'white' : 'black'}`, backgroundColor: `${isHovered ? 'black' : 'transparent'}`}}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            > */}
                {/* <FontAwesomeIcon color={`${isHovered ? 'white' : 'black'}`} icon={faKey} />
            </Button> */}
            <div
                onClick={openModal} 
                variant="outline-success" 
                size="sm" 
                style={{ 
                    // style={{
                display: 'flex',
                alignItems: 'center', // Align items along the cross axis
                gap: '0',
                margin: '0',
                justifyContent: "center",
                    //   }}
                    // height: "50px" ,
                // paddingTop: "2px", margin:"0", 
                color: `${isHovered ? 'white' : 'black'}`, 
                backgroundColor: `${isHovered ? 'black' : 'transparent'}`,
                height:"100%",
                width:"4rem" ,
                // backgroundColor: "#f6f6f6",
                padding: "18px 20px",
                // color: "white",
                cursor: "pointer",
                marginLeft: "0px",
                // color:  `${}`,
                borderTop: "0",
                borderBottom: "0",
                // borderLeft: "1px solid black",
                borderRight: "1px solid black",
                // borderLeft:"1px solid black"
            }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}

            >
                {/* <FontAwesomeIcon 
                     color={`${isHovered ? 'white' : 'black'}`} 
                     icon={faKey} 
                     style={{
                        fontSize: "1.5rem"
                     }}
                /> */}
                <svg width="32" height={"32"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 14.75C14.2444 14.7516 13.4959 14.604 12.7975 14.3157C12.0991 14.0274 11.4644 13.6041 10.93 13.07C9.98333 12.1279 9.39276 10.8867 9.259 9.55784C9.12524 8.22903 9.45659 6.89497 10.1965 5.78315C10.9365 4.67134 12.0392 3.85063 13.3166 3.46099C14.594 3.07135 15.967 3.1369 17.2015 3.64647C18.436 4.15604 19.4555 5.07807 20.0862 6.25532C20.7168 7.43257 20.9196 8.79213 20.6598 10.1022C20.4001 11.4122 19.6939 12.5915 18.6618 13.4391C17.6297 14.2867 16.3355 14.75 15 14.75ZM15 4.74996C14.1609 4.75201 13.3413 5.00238 12.6443 5.46952C11.9473 5.93665 11.4041 6.59965 11.0833 7.37495C10.7625 8.15026 10.6784 9.00318 10.8415 9.82623C11.0046 10.6493 11.4077 11.4056 12 12C12.4939 12.4956 13.1025 12.8615 13.7718 13.0655C14.4411 13.2694 15.1504 13.3049 15.8367 13.1689C16.523 13.0328 17.1651 12.7295 17.706 12.2857C18.2469 11.8419 18.6699 11.2714 18.9375 10.6249C19.205 9.97844 19.3087 9.27589 19.2396 8.57965C19.1704 7.88342 18.9303 7.21503 18.5408 6.63383C18.1513 6.05262 17.6243 5.57657 17.0066 5.24794C16.3889 4.91931 15.6997 4.74825 15 4.74996Z" fill={`${isHovered ? 'white' : 'black'}`}/>
                    <path d="M4.5 20.25C4.30706 20.2352 4.12757 20.1455 4 20C3.87702 19.8625 3.80902 19.6844 3.80902 19.5C3.80902 19.3155 3.87702 19.1375 4 19L10.46 12.53C10.6019 12.3894 10.7938 12.311 10.9935 12.3119C11.0924 12.3124 11.1903 12.3323 11.2815 12.3706C11.3726 12.4088 11.4554 12.4647 11.525 12.535C11.5946 12.6052 11.6497 12.6885 11.6871 12.78C11.7245 12.8716 11.7435 12.9696 11.7431 13.0685C11.7426 13.1674 11.7227 13.2652 11.6844 13.3564C11.6461 13.4476 11.5903 13.5304 11.52 13.6L5 20C4.87243 20.1455 4.69295 20.2352 4.5 20.25Z" fill={`${isHovered ? 'white' : 'black'}`}/>
                    <path d="M8 20.75C7.90146 20.7504 7.80382 20.7312 7.71281 20.6934C7.62179 20.6557 7.53924 20.6001 7.47 20.53L5.47 18.53C5.33752 18.3878 5.2654 18.1997 5.26882 18.0054C5.27225 17.8111 5.35096 17.6258 5.48838 17.4883C5.62579 17.3509 5.81118 17.2722 6.00548 17.2688C6.19978 17.2654 6.38782 17.3375 6.53 17.47L8.53 19.47C8.67045 19.6106 8.74934 19.8012 8.74934 20C8.74934 20.1987 8.67045 20.3893 8.53 20.53C8.46075 20.6001 8.3782 20.6557 8.28719 20.6934C8.19618 20.7312 8.09854 20.7504 8 20.75Z" fill={`${isHovered ? 'white' : 'black'}`}/>
                    <path d="M10 18.7499C9.90146 18.7504 9.80382 18.7312 9.71281 18.6934C9.6218 18.6556 9.53925 18.6 9.47 18.5299L7.47 16.5299C7.39631 16.4612 7.33721 16.3784 7.29622 16.2864C7.25523 16.1944 7.23319 16.0951 7.23141 15.9944C7.22963 15.8937 7.24816 15.7937 7.28588 15.7003C7.3236 15.6069 7.37974 15.5221 7.45096 15.4509C7.52218 15.3797 7.60701 15.3235 7.7004 15.2858C7.79379 15.2481 7.89382 15.2295 7.99452 15.2313C8.09523 15.2331 8.19454 15.2551 8.28654 15.2961C8.37854 15.3371 8.46134 15.3962 8.53 15.4699L10.53 17.4699C10.6705 17.6105 10.7493 17.8012 10.7493 17.9999C10.7493 18.1987 10.6705 18.3893 10.53 18.5299C10.4608 18.6 10.3782 18.6556 10.2872 18.6934C10.1962 18.7312 10.0985 18.7504 10 18.7499Z" fill={`${isHovered ? 'white' : 'black'}`}/>
                </svg>
            </div>
            <Modal show={open} onHide={closeModal}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <PasswordInput
                            label="Hashnode Secret"
                            value={hashnodeSecret}
                            onChange={(e) => setHashnodeSecret(e.target.value)}
                        />
                        <PasswordInput
                            label="Medium Secret"
                            value={mediumSecret}
                            onChange={(e) => setMediumSecret(e.target.value)}
                        />
                        <PasswordInput
                            label="Open AI API key"
                            value={openAISecret}
                            onChange={(e) => setOpenAISecret(e.target.value)}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Close
                        </Button>
                        <Button variant="success" type="submit">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default Keys;