import React, { useState, useRef } from 'react'
import {useAuth} from "../../contexts/AuthContext"
import {Card, Button, Form, Alert} from "react-bootstrap"
// import '../../index.css'
import { useNavigate, Link} from 'react-router-dom';
import CentredContainer from './CentredContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage, database } from '../../firebase';
import { getDoc, setDoc, addDoc, doc } from "firebase/firestore"

export default function UpdateProfile() {

    const {UpdateEmail, UpdatePassword, currentUser, UpdateProfileImage } = useAuth();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleUpload(e) {
        const file = e.target.files[0];
        // if (currentFolder == null || file == null) return

        // console.log(currentFolder.path)
        
        const uploadRef = ref(storage, `/files/${currentUser.uid}/${currentUser.uid}.png`);

        // const uploadTask = uploadBytes(uploadRef, file);

        uploadBytes(uploadRef, file)
        .then(snapshot => {
            return getDownloadURL(snapshot.ref)
        })
        .then(downloadURL => {
            UpdateProfileImage(downloadURL)

        })

        window.location.reload();
    }

    function handleSubmit(event) {
        event.preventDefault();

        if(passwordRef.current.value !== confirmPasswordRef.current.value){
            return setError("passwords do not match")
        }

        if(passwordRef.current.value.length < 6) {
            return setError("password should be of at least 6 characters")
        }

        if(passwordRef.current.value === "" && emailRef.current.value === ""){
            return setError("Enter at least one")
        }

        const promises = []
        setLoading(true)
        setError("")

        if (emailRef.current.value !== currentUser.email) {
            promises.push(UpdateEmail(emailRef.current.value))
        }
        if (passwordRef.current.value) {
            promises.push(UpdatePassword(passwordRef.current.value))
        }

        Promise.all(promises)
        .then(() => {
            navigate("/user")
        })
        .catch(() => {
            setError("Failed to update account")
        })
        .finally(() => {
            setLoading(false)
        })

    }

    return (
        <CentredContainer>
            <Card>
                <Card.Body>
                    {/* <h2 className="text-center mb-4">Update Profile</h2>
                    <hr /> */}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                    {/* <label className='btn btn-outline-success btn-sm m-0 mx-2'>
                    </label> */}
                        <Form.Group id="profile-picture">
                                {!currentUser.photoURL   
                                ?   <Form.Label htmlFor="file" className='text-center' style={{ display: "inline-block",width: "100%", fontSize: "3.5rem"}}>
                                        <FontAwesomeIcon className='p-3' style={{border: "1px solid black", borderRadius: "100%"}} icon={faUser} /> 
                                    </Form.Label>
                                :   <Form.Label htmlFor="file" className='d-flex justify-content-center'>
                                    {/* <div className='w-100' style={{ display: "flex", justifyContent: "center"}}> */}
                                    < img alt='avatar' className='image-responsive' src={currentUser.photoURL}  style={{borderRadius: "100%", width: "30%", height: "30%", pointerEvents: "none"}}/>
                                    {/* </div> */}
                                </Form.Label>
                            }
                            <Form.Control onChange={handleUpload} id="file" type="file" style={{ opacity: 0, position: 'absolute', left: '-99999px'}}  />
                            
                        </Form.Group>
                        <hr />
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder='leave blank to update only password'  ref={emailRef} />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder='leave blank to update only email' ref={passwordRef} />
                        </Form.Group>
                        <Form.Group id="confirm-password">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control placeholder='leave blank to update only email' type="password" ref={confirmPasswordRef} />
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-2 btn-dark" type="submit">
                            Update
                        </Button>
                    </Form>
                    {/* <div className="w-100 text-center mt-3">
                        <Link to="/forgot-password" className='link'>Forgot Password?</Link>
                    </div> */}
                </Card.Body>
            </Card>
            <div className="w-100 text-center text-black mt-2">
                <Link to="/profile" className='text-black'>Cancel</Link>
            </div>
        </CentredContainer>
    )
}
