import React, {useState} from "react"

import Sidebar from "./Sidebar"
// import Auth from "./components/Auth"
import Editor from "./Editor"
import Split from "react-split"

import { onSnapshot, collection, addDoc, setDoc, getDoc,  doc, deleteDoc, query, where } from "firebase/firestore"
import { notesCollection, db } from "../firebase"
import "bootstrap/dist/css/bootstrap.min.css"
import {Container} from "react-bootstrap" 
import NavbarComponent from "./Navbar"
import { useAuth } from "../contexts/AuthContext"

export default function Main() {
    const { currentUser } = useAuth();
    const [notes, setNotes] = React.useState([])
    const [notesLen, setNotesLen] = React.useState(null)
    const [currentNoteId, setCurrentNoteId] = React.useState("");
    const [tempNoteText, setTempNoteText] = React.useState("");

    const [hashnodeSecret, setHashnodeSecret] = useState("");
    const [mediumSecret, setMediumSecret] = useState("");
    const [openAISecret, setOpenAISecret] = useState("");
    const [devToSecret, setDevToSecret] = useState("");

    const updateHashnode = (value) => {
        setHashnodeSecret(value)
    }

    const updateDevTo = (value) => {
        setDevToSecret(value)
    }
 
    const onTempNoteTextChange = (newValue) => {
        // Update the state with the new value
        setTempNoteText(newValue);
    };

    const [title, setTitle] = React.useState("New title 34-35");
    // const [title, setTitle] = useState('New Note');

    // const updateTitle = (newTitle) => {
    //     setTitle(newTitle)
    // }

    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

    const updateTitle = (newTitle) => {
        setTitle(newTitle);
        // Update the current note's title in Firestore
        if (currentNoteId) {
          const docRef = doc(db, "notes", currentNoteId);
          setDoc(docRef, { title: newTitle }, { merge: true });
        }
    };

    React.useEffect(() => {
        if (!currentUser) return;

        const userNotesQuery = query(notesCollection, where("userId", "==", currentUser.uid));
        const unsubscribe = onSnapshot(userNotesQuery, function(snapshot) {
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                title: doc.data().title
            }));
            setNotesLen(notesArr.length)
            setNotes(notesArr);
        });

        return unsubscribe;
    }, [currentUser]);

    // React.useEffect(() => {
    //     const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
    //     // Sync up our local notes array with the snapshot data
    //         const notesArr = snapshot.docs.map(doc => ({
    //             ...doc.data(), 
    //             id: doc.id 
    //         }))
    //         setNotes(notesArr)
    //     })
    //     return unsubscribe
    // }, [])

     
    React.useEffect(() => {
        if (!currentNoteId)  {
            setCurrentNoteId(notes[0]?.id)
        }
        
    }, [notes])

    React.useEffect(() => {
        if (currentNote) {
            setTempNoteText(currentNote?.body)
            setTitle(currentNote?.title)
        }
    }, [currentNote])

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote?.body) {
                updateNote(tempNoteText, title)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText, title])

    // console.log(sortedNotes)

    // async function createNewNote() {
    //     const newNote = {
    //         body: "# Type your markdown note's title here",
    //         createdAt: Date.now(),
    //         updatedAt: Date.now()
    //     }
    //     const newNoteRef = await addDoc(notesCollection, newNote)
    //     setCurrentNoteId(newNoteRef.id)
    // }

    async function createNewNote() {
        if (!currentUser) return;

        const newNote = {
            title: "New Note",
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            userId: currentUser.uid // Associate the note with the current user
        };

        const newNoteRef = await addDoc(notesCollection, newNote);
        setCurrentNoteId(newNoteRef.id);
    }

    // async function deleteNote(noteId) {
    //     if (!currentUser) return;

    //     const docRef = doc(db, "notes", noteId);
    //     const note = await docRef.get();
    //     if (note.exists() && note.data().userId === currentUser.uid) {
    //         await deleteDoc(docRef);
    //     }
    // }

    async function deleteNote(noteId) {
        if (!currentUser) {
            console.log("No currentUser, exiting deleteNote");
            return;
        }
    
        const docRef = doc(db, "notes", noteId);
        console.log("Attempting to delete note with ID:", noteId);
        console.log("this is docRef: ", docRef)
    
        const note = await getDoc(docRef);
        console.log("Note exists:", note.exists());
    
        if (note.exists() && note.data().userId === currentUser.uid) {
            console.log("Deleting note...");
            await deleteDoc(docRef);
            console.log("Note deleted successfully.");
        } else {
            console.log("Note does not exist or user does not have permission.");
        }
    }

    async function updateNote(text, newTitle) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, { body: text,title: newTitle, updatedAt: Date.now() }, { merge: true })
    }

    // async function deleteNote(noteId) {
    //     // event.stopPropagation()
    //     // setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
    //     const docRef = doc(db, "notes",noteId)
    //     await deleteDoc(docRef)
    // }

    return (
        <main>
            {
                 
                notesLen === null
                 ? 
                 <div className="no-notes">
                    <h1>Loading...</h1>
                 </div>
                 :(notesLen > 0
                    ?
                    <div>
                        <NavbarComponent 
                            currentNoteText={tempNoteText} 
                            currentNote={currentNote} 
                            
                            hashnodeSecret={hashnodeSecret}
                            updateHashnode={updateHashnode}
                            
                            updateDevTo={updateDevTo}
                            
                            setHashnodeSecret={setHashnodeSecret}
                            
                            mediumSecret={mediumSecret}
                            setMediumSecret={setMediumSecret}
                            
                            openAISecret={openAISecret}
                            setOpenAISecret={setOpenAISecret}

                            devToSecret={devToSecret}
                            setDevToSecret={setDevToSecret}
                        />
                        <Split
                            sizes={[20, 80]}
                            direction="horizontal"
                            className="split"
                        >
                            <Sidebar
                                notes={sortedNotes}
                                currentNote={currentNote}
                                setCurrentNoteId={setCurrentNoteId}
                                newNote={createNewNote}
                                deleteNote={deleteNote}
                                title={title}
                            />
                            
                                <Editor
                                    currentNote={currentNote}
                                    editorTitle={currentNote?.title}
                                    setEditorTitle={updateTitle}
                                    tempNoteText={tempNoteText}
                                    onTempNoteTextChange={onTempNoteTextChange}
                                    // setTempNoteText={setTempNoteText}
                                    hashnodeSecret={hashnodeSecret}
                                    updateHashnode={updateHashnode}
                                    setHashnodeSecret={setHashnodeSecret}
                                    mediumSecret={mediumSecret}
                                    setMediumSecret={setMediumSecret}
                                    openAISecret={openAISecret}
                                    setOpenAISecret={setOpenAISecret}
                                    devToSecret={devToSecret}
                                    setDevToSecret={setDevToSecret}
                                />
                        </Split>
                    </div>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                        </button>
                    </div>)
                    // <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
                    //     <div className="w-100" style={{maxWidth: "400px"}}>
                    //         <Auth />
                    //     </div>
                    // </Container>
            }
        </main>
    )
}
