import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { db, notesCollection, secretsCollection } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { addDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const ConvertToBlog = ({currentNoteText}) => {
    const [open, setOpen] = useState(false);
    // const [hashnodeSecret, setHashnodeSecret] = useState("");
    // const [mediumSecret, setMediumSecret] = useState("");
    // const [openAISecret, setOpenAISecret] = useState("");
    const [generatedNote, setGeneratedNote] = useState("");
    const[prompt, setPrompt] = useState("create a blog from the above text in markdown form, don't write anything else like here is your blog, etc. Blog should be elegant in writing style, to the point, engaging and reading level should not be above 8th grade student: ");
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const apiKey = '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';

    const {currentUser} = useAuth();

    const openModal = () => {
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestPrompt = `${currentNoteText}${prompt}`;
    
        if (!currentUser) {
            return; // User is not authenticated
        }

        console.log(requestPrompt);

        try {
            const response = await fetch('http://localhost:3000/generate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ apiKey, requestPrompt }),
            });
      
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
      
            const data = await response.json();
            // console.log(data); // Log the received data
           
            // setGeneratedNote(data.text)
            console.log(data.response)
            // console.log(generatedNote);
            // console.log(data.response)
            // setGeneratedNote(data.response)
            // console.log(generatedNote)
            console.log(data)
            setGeneratedNote(data.output);
            console.log(data.output)
            console.log(data.text)
            console.log(generatedNote)

            const newNote = {
                body: data.response, 
                createdAt: Date.now(),
                updatedAt: Date.now(),
                userId: currentUser.uid // Associate the note with the current user
            };
    
            const newNoteRef = await addDoc(notesCollection, newNote);
            setCurrentNoteId(newNoteRef.id);
        } catch (error) {
            console.error('Error:', error);
        }
    
    };

    // const fetchUserSecrets = async () => {
    //     if (currentUser) {
    //         const userSecretDocRef = doc(secretsCollection, currentUser.uid);
    //         const userSecretDocSnapshot = await getDoc(userSecretDocRef);
    //         if (userSecretDocSnapshot.exists()) {
    //             const data = userSecretDocSnapshot.data();
    //             setHashnodeSecret(data.hashnodeSecret || "");
    //             setMediumSecret(data.mediumSecret || "");
    //             setOpenAISecret(data.openAISecret || "");
    //         }
    //     }
    // };

    // useEffect(() => {
    //     fetchUserSecrets();
    // }, [currentUser]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center', // Align items along the cross axis
            gap: '0',
            margin: '0',
          }} >
            {/* <div style={{height: "100%", display:'inline-block', border: "1px solid black"}}>
                <a href='fjdl.dflkj' >dfjl</a>
            </div> */}
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
                    //   }}
                    // height: "50px" ,
                // paddingTop: "2px", margin:"0", 
                color: `${isHovered ? 'white' : 'black'}`, 
                backgroundColor: `${isHovered ? 'black' : 'transparent'}`,
                height:"100%",
                // backgroundColor: "#f6f6f6",
                padding: "8px 20px",
                // color: "white",
                cursor: "pointer",
                marginLeft: "0px",
                // color: "black",
                borderTop: "0",
                borderBottom: "0",
                // borderLeft: "1px solid black",
                borderRight: "1px solid black",
                borderLeft:"1px solid black"
            }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                ConvertToBlog
            </div>
            <Modal show={open} onHide={closeModal}
                style={{
                    backdropFilter: 'blur(2px)'
                }}
            >
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Label style={{fontSize: "1.5rem", fontWeight: "500"}}>Prompt</Form.Label>
                        <Form.Control as="textarea" 
                            value={prompt} rows={7} 
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </Modal.Body>
                    <Modal.Footer style={{border: "none"}}>
                        <Button style={{
                            border: "1px solid black",
                            backgroundColor: "white",
                            color: "black",
                        }} className='closeModal' onClick={closeModal}>
                            Close
                        </Button>
                        <Button variant="dark" type="submit">
                            Convert
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default ConvertToBlog;