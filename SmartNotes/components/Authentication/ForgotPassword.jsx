import React, { useState, useRef } from 'react'
import {useAuth} from "../../contexts/AuthContext"
import { Link} from 'react-router-dom';
import {Card, Button, Form, Alert} from "react-bootstrap"
// import '../../index.css'
import CentredContainer from './CentredContainer';


export default function ForgotPassword() {
    const {resetPassword} = useAuth();
    const emailRef = useRef();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    // const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        
        try {
            setMessage("")
            setError("")
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage("Check your inbox for further instructions")
        } catch {
            setError("Failed to reset password")
        }
        setLoading(false)
    }

    return (
        <CentredContainer>
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Password Reset</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Button disabled={loading} className="w-100 mt-2 btn-dark" type="submit">
                        Reset Password
                    </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                    <Link to="/login" className='link'>Login</Link>
                </div>
            </Card.Body>
        </Card>
        <div className="w-100 text-center text-black mt-2">
            Need an account? <Link to="/signup" className='text-black'>Sign Up</Link>
        </div>
    </CentredContainer>
    )
}