import React from 'react'
import {Navbar,Image, Nav} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../contexts/AuthContext'
import Keys from './Keys';
import ConvertToBlog from './ConvertToBlog'
import PublishBlog from './PublishBlog'
import Profile from './Profile'

export default function NavbarComponent({currentNoteText, currentNote, mediumSecret, setMediumSecret,
    hashnodeSecret, setHashnodeSecret,openAISecret ,setOpenAISecret, updateHashnode, devToSecret, setDevToSecret,updateDevTo }) {
    const { currentUser } = useAuth()
    console.log(currentUser.photoURL)
    const avatar = currentUser.photoURL
    return (
        <>
            <Navbar style={{
            backgroundColor: '#f6f6f6',
            borderBottom: "1px solid black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "stretch",
            padding: "0 0 0 0px",
            // padding: "0 20px 0px 0", // Top Right Bottom Left
        }}>

                <Navbar.Brand 
                // className='text-black font-weight-bold' 
                as={Link} to="/" 
                style={{
                    fontFamily: "Maven Pro",
                    fontWeight: "600",
                    height: "100%",
                    margin: "0",
                    fontSize: "2rem",
                    paddingLeft: "10px",
                    padding: "15px",
                    borderRight: "1px solid black",
                }}               
                >
                    SmartNotes
                </Navbar.Brand>

                <div
                    className="divs" style={{
                        display: 'flex',
                        alignItems: 'stretch',
                        gap: '0',
                        margin: '0',
                    }}
                >

                    <ConvertToBlog 
                        currentNoteText={currentNoteText} 
                        currentNote={currentNote} 
                        openAISecret={openAISecret}
                    />
                    <Keys
                        hashnodeSecret={hashnodeSecret}
                        updateHashnode={updateHashnode}
                        setHashnodeSecret={setHashnodeSecret}
                        mediumSecret={mediumSecret}
                        setMediumSecret={setMediumSecret}
                        openAISecret={openAISecret}
                        setOpenAISecret={setOpenAISecret}
                        devToSecret={devToSecret}
                        setDevToSecret={setDevToSecret}
                        updateDevTo={updateDevTo}
                    />
                    {/* <Nav.Link  as={Link} to="/profile" style={{alignSelf: "stretch"}}> */}
                        <Profile avatarImg={avatar} />
                        {/* </Nav.Link> */}
                    </div>
                {/* </Nav> */}
            </Navbar>
        </>
    )
}

