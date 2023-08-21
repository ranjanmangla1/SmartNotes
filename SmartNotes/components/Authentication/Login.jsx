import React, { useState, useRef } from 'react'
import {useAuth} from "../../contexts/AuthContext"
import { useNavigate, Link} from 'react-router-dom';
import {Card, Button, Form, Alert} from "react-bootstrap"
import CentredContainer from './CentredContainer';


export default function LogIN() {
    const {login, googleSignIn, githubSignIn} = useAuth();
    const emailRef = useRef();
    const passwordRef = useRef();
    const githubLogoRef = useRef()
;    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleGoogle(event) {
        event.preventDefault();
        try {
            setLoading(true);
            await googleSignIn();
            navigate("/");
        } catch(error) {
            console.error(error)
            setError("problem while signing with google")
        }
    }

    async function handleGithub(event) {
        event.preventDefault();
        try {
            setLoading(true);
            await githubSignIn();
            navigate("/");
        } catch(error) {
            console.error(error)
            setError("problem while signing with google")
        }
    }

    function handleMouseHover() {
        githubLogoRef.current.src = '/github-mark-white.png';
    }

    function handleMouseOut() {
        githubLogoRef.current.src = '/github-mark.png';
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log(event.preventDefault())

        setError("");

        try{
            setLoading(true)
            // await login(emailRef.current.value, passwordRef.current.value)
            // console.log(login(formData.email,formData.password))
            await login(emailRef.current.value,passwordRef.current.value);
            try{
                // console.log(navigate("/"))
                navigate("/");
            } catch(error) {
                console.error(error)
                setError("navigate did not work")
            }
            // console(navigate("/"))
        } catch(error) {
            console.error(error)
            setError("there was an error in try catch")
        } finally{
            setLoading(false)
        }
        // console.log(signup(formData.email, formData.password))
    }
    // console.log(formData)

    return (
        <CentredContainer>
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Log In</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <div>
                    <Button disabled={loading} className="w-100 btn-outline-dark btn-light mt4 mb-2 custom-google-btn" type="submit" onClick={handleGithub} onMouseOver={handleMouseHover} onMouseOut={handleMouseOut}>
                        <div className='google-btn'>
                            <img alt='github-logo' className='align-middle mt-0 mb-0 googleLogo' src='/github-mark.png' ref={githubLogoRef}   />
                            <span>Sign In with Github</span>
                        </div>
                    </Button>
                    <Button disabled={loading} className="w-100 btn-outline-dark btn-light mt4 mb-2 custom-google-btn" type="submit" onClick={handleGoogle}>
                        <div className='google-btn'>
                            <img alt='google-logo' className='align-middle mt-0 mb-0 googleLogo' src='/google.png'  />
                            <span>Sign In with Google</span>
                        </div>
                    </Button>   
                </div>
                
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>
                    <Button disabled={loading} className="w-100 mt-2 btn-dark" type="submit">
                        Log In
                    </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                    <Link to="/forgot-password" className='link'>Forgot Password?</Link>
                </div>
            </Card.Body>
        </Card>
        <div className="w-100 text-center text-black mt-2">
            Need an account? <Link to="/signup" className='text-black'>Sign Up</Link>
        </div>
    </CentredContainer>
    )
}