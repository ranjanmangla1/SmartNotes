import React from 'react'
import {useAuth} from "../../contexts/AuthContext"
import {Link, useNavigate } from "react-router-dom"
import {Button, Card, Alert } from "react-bootstrap"
import CentredContainer from './CentredContainer'

export default function Profile() {

    const {currentUser, logOut} = useAuth();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const navigate = useNavigate();

    function handleLogout(e) {
        // e.preventDefaults();
        try {
            setLoading(true);
        logOut();
        navigate("/login");
        } catch(error) {
            setError('unable to log in')
        }
    }

    function handleHome() {
      // e.preventDefaults;
      navigate("/");
    }
    return (
        <CentredContainer>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Profile</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <strong>Email:</strong> {currentUser.email}
              <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                Update Profile
              </Link>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            <Button disable={loading} variant="link" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
          <div className="w-100 text-center text-black mt-2">
            <Button disable={loading} variant="link" onClick={handleHome}>
              Go back to Home
            </Button>
          </div>
      </CentredContainer>
    )
}
