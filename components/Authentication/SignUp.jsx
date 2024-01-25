import React, { useRef, useState } from 'react'
import {useAuth} from "../../contexts/AuthContext"
import {Card, Button, Form, Alert} from "react-bootstrap"
// import '../../index.css'
import { useNavigate, Link} from 'react-router-dom';
import CentredContainer from './CentredContainer';

export default function SignUp() {
    
    const {signup} = useAuth();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        if(passwordRef.current.value !== confirmPasswordRef.current.value){
            return setError("there was an error!")
        }

        if(passwordRef.current.value.length < 6) {
            return setError("password should be of at least 6 characters")
        }

        setError("");

        try{
            setLoading(true)
            signup(emailRef.current.value, passwordRef.current.value)
            navigate("/login")
        } catch{
            setError("Failed to create an account")
        }
        setLoading(false)
        // console.log(signup(formData.email, formData.password))
    }
    // console.log(formData)

    return (
        <CentredContainer>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Form.Group id="confirm-password">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" ref={confirmPasswordRef} required />
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-2 btn-dark" type="submit">
                            SignUp
                        </Button>
                    </Form>
                    {/* <div className="w-100 text-center mt-3">
                        <Link to="/forgot-password" className='link'>Forgot Password?</Link>
                    </div> */}
                </Card.Body>
            </Card>
            <div className="w-100 text-center text-black mt-2">
                Already have an account? 
                <Link to="/login" className='text-black'>Login</Link>
            </div>
        </CentredContainer>
    )
}
