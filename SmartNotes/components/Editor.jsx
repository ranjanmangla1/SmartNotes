import React, {useEffect, useState} from "react"
import ReactMde from "react-mde"
import Showdown from "showdown"
import PublishBlog from "./PublishBlog";
import { handleImageUpload } from "../firebase";
// import { useRef } from "react";

export default function Editor({ tempNoteText, 
  editorTitle, setEditorTitle, 
  onTempNoteTextChange, mediumSecret, setMediumSecret, hashnodeSecret, setHashnodeSecret,openAISecret ,setOpenAISecret, updateHashnode, devToSecret, setDevToSecret, 
  currentNote}) {
    const [selectedTab, setSelectedTab] = React.useState("write")

    const handleTitle = (newTitle) => {
      console.log("handleTitle is called with title:", newTitle);
      setEditorTitle(newTitle);
    }



    // const [editorTitle, setEditorTitle] = useState(currentNote?.title || 'New Note');


    // const [note, setNote] = useState("");

    // use useEffect to update note whenever tempNoteText changes
    // useEffect(() => {
    //   // set note to be equal to tempNoteText
    //   setNote(tempNoteText);
    //   console.log("note Effect: " + note)
    // }, [tempNoteText]);

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true,
    })  

    useEffect(() => {
      // Find the existing file input element within the React-mde component
      const fileInput = document.querySelector('.image-input'); // Replace with the actual selector
  
      if (fileInput) {
        // Add an event listener for the 'change' event
        fileInput.addEventListener('change', handleFileInputChange);
      }
  
      return () => {
        // Remove the event listener when the component unmounts to avoid memory leaks
        if (fileInput) {
          fileInput.removeEventListener('change', handleFileInputChange);
        }
      };
    }, [onTempNoteTextChange]);

    const handleFileInputChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        // Custom logic to upload the image and get its URL
        const imageUrl = await handleImageUpload(file);
  
        if (imageUrl) {
          // Create a markdown image link
          const markdownImage = `![Alt Text](${imageUrl})`;
  
          // Use React-mde's method to update the editor content
          onTempNoteTextChange((prevText) => prevText + markdownImage);
        } else {
          console.error('Image upload failed.');
        }
      }
    };

    // const updateNote = (img) => {
    //   onTempNoteTextChange(tempNoteText.replace("![Uploading image...]()", img))
    // }

    const pasteImageFromClipboard = async () => {
      console.log("entered clipboard")
    try {
      const permission = await navigator.permissions.query({
        name: "clipboard-read",
      });

      if (permission.state === "denied") {
        throw new Error("Not allowed to read clipboard.");
      }

      const clipboardContents = await navigator.clipboard.read();
      console.log("Clipbaord: "+ clipboardContents)

      for (const item of clipboardContents) {
        if (item.types.includes("image/png")) {
          const blob = await item.getType("image/png");
          const imageUrl = await handleImageUpload(blob);

          if (imageUrl) {
            const markdownImage = `![Alt Text](${imageUrl})`;
            console.log("url: " + markdownImage)

            onTempNoteTextChange( prevText => 
              prevText.replace(/!\[Uploading image...\]\(\)/g, markdownImage)
            );

            setTimeout(() => {
              window.location.reload();
            }, 1000);

            // updateNote(markdownImage);
            // setTempNoteText((prevText) => prevText + markdownImage);
            // console.log("Before setTempNoteText:", tempNoteText);

            // let note = tempNoteText;
            // console.log("tempNote: " + note)

            // updateTempNoteText
            // setTempNoteText(note.replace())
            // setTempNoteText(prevText => prevText + markdownImage);

            // setTempNoteText(prevText => prevText.replace("![Uploading image...]()", markdownImage))
            
            // console.log("After setTempNoteText:", tempNoteText);
          } else {
            console.error("Image upload failed.");
          }
        } else {
          console.error("Clipboard contains non-image data.");
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleImageDrop = async (event) => {
    // event.preventDefault();
    console.log("entered in drop logic")
    const files = event.dataTransfer.files;
  
    if (files.length > 0) {
      const blob = files[0];
      const imageUrl = await handleImageUpload(blob);
  
      if (imageUrl) {
        const markdownImage = `![Alt Text](${imageUrl})`;
        onTempNoteTextChange((prevText) => prevText + markdownImage);
      } else {
        console.error("Image upload failed.");
      }
    }
  };

  useEffect(() => {
    console.log("After setTempNoteText:", tempNoteText);
  }, [tempNoteText]);

    return (
        <section className="pane editor">
            <div className="d-flex flex-column">
                <input type="text" 
                    placeholder="Enter Title" 
                    value={editorTitle}
                    className="title-input"
                    style={{
                        border: "none",
                        height: "60px",
                        width: '100%'
                    }}
                    onChange={(e) => handleTitle(e.target.value)}   
                />
                <ReactMde
                    value={tempNoteText}
                    onChange={onTempNoteTextChange}
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    generateMarkdownPreview={(markdown) =>
                        Promise.resolve(converter.makeHtml(markdown))
                    }
                    minEditorHeight={67}
                    heightUnits="vh"
                    paste={{
                      saveImage: pasteImageFromClipboard,
                    }}
                />
              <PublishBlog
                hashnodeSecret={hashnodeSecret}
                updateHashnode={updateHashnode}
                setHashnodeSecret={setHashnodeSecret}
                mediumSecret={mediumSecret}
                setMediumSecret={setMediumSecret}
                openAISecret={openAISecret}
                setOpenAISecret={setOpenAISecret}
                devToSecret={devToSecret}
                setDevToSecret={setDevToSecret}
                currentNoteText={tempNoteText}
                editorTitle={editorTitle}
              />
            </div>
        </section>
    )
}