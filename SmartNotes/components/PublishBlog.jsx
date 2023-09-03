import React, { useState } from 'react'
import { Button, Modal, Form, ButtonGroup } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext';
import { handleImageUpload } from '../firebase';

const PublishBlog = ({ currentNoteText, mediumSecret, hashnodeSecret, openAISecret, editorTitle }) => {
  const [open, setOpen] = useState(false);

  const [checkedBoxes, setCheckedBoxes] = useState({
    Hashnode: false,
    Medium: false,
    'Dev.to': false,
  });

  const [uploadType, setUploadType] = useState('upload'); // 'upload' or 'link'
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageLink, setImageLink] = useState('');
    console.log("editor title: " + editorTitle)
    // const [title, setTitle] = useState(editorTitle);
    const [title, setTitle] = useState(editorTitle);
    const [description, setDescription] = useState("");
    const [canonicalUrl, setCanonicalUrl] = useState("");
    const [tags, setTags] = useState("");
    const [series, setSeries] = useState("");

  const {currentUser} = useAuth();

  const openModal = () => {
       setOpen(true);
   };

   const closeModal = () => {
        setOpen(false);
    };

    const handleCheckboxChange = (label) => {
        setCheckedBoxes((prevCheckedBoxes) => ({
          ...prevCheckedBoxes,
          [label]: !prevCheckedBoxes[label],
        }));
    };

    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleUploadTypeChange = (newUploadType) => {
      setUploadType(newUploadType);
    };
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      setSelectedImage(file);
    };
  
    const handleLinkChange = (e) => {
      setImageLink(e.target.value);
    };

    // const handleTags = (e) => {
      
      // console.log(arrayOfValues);
    //   setTags(arrayOfValues);
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();

      const commaSeparatedString = tags;
      const tagArray = commaSeparatedString.split(",");

      const seriesArray = series.split(",");

        console.log(checkedBoxes);
        // let imageUrl = "";

        if (uploadType === 'upload') {
          if (selectedImage) {
            const imageUrl = await handleImageUpload(file);
            setImageLink(imageUrl)
            setRenderedContent(<Image src={imageUrl} alt="Uploaded" />);
          }
        }

        if(checkedBoxes[Hashnode]) {
            console.log('posting blog on hashnode')
        }

        if (checkedBoxes['Dev.to']) {
            // Use Markdown format for content
            const body_markdown = currentNoteText;

            const article = {
              title: {title},
              body_markdown, // Use the variable defined above
              tags: tagArray,
              series: seriesArray,
              published: true, // Set to true if you want to publish the article
              // Add user input for these properties
              main_image: imageLink, // Set to a valid image URL or null
              canonical_url: canonicalUrl, // Set to the original URL or null
              description: description, // Set to a short description or null
            };
          
            const articleData = { article };
          
            try {
              const devtoResponse = await fetch(`http://localhost:3001/post-article`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(articleData),
              });
          
              const devtoData = await devtoResponse.json();
          
              if (devtoResponse.ok) {
                console.log('Article posted successfully on Dev.to', devtoData);
              } else {
                console.error('Error posting article:', devtoData);
              }
            } catch (error) {
              console.error('Error:', error);
            }
          }
          

        if(checkedBoxes['Medium']) {
            const blogData = {
                title: title,
                content: currentNoteText,
                canonicalUrl: canonicalUrl,
                tags: tagArray,
              };
              
              fetch('http://localhost:3000/post-blog', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': mediumSecret
                },
                body: JSON.stringify(blogData),
              })
                .then(response => response.json())
                .then(data => {
                  console.log('Response:', data);
                })
                .catch(error => {
                  console.error('Error:', error);
                });
        }
    }

  return (
    <div>
        <Button 
            onClick={openModal} 
            size="sm" 
            variant="dark" 
            // onMouseEnter={handleMouseEnter}
            style={{ padding: "11px 7px", margin:"0.8rem" ,border: "1px solid black", borderRadius: "3px"}}
            // onMouseLeave={handleMouseLeave}
        >
                {/* <FontAwesomeIcon icon={faKey} /> */}
                Publish Blog
        </Button>
        <Modal style={{
                    backdropFilter: 'blur(2px)',
                }} show={open} onHide={closeModal} className='publishBlogModal'>
            <Form onSubmit={handleSubmit}>
                {/* <Modal.Header
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "none",
                    marginBottom: "0"
                  }}
                >
                  <p style={{fontFamily: "Montserrat", fontWeight: "600", fontSize: "1.5rem"}}>Publish to</p>
                </Modal.Header> */}
                <Modal.Body 
                  // className='d-flex justify-content-between'
                >
                   {/* <p style={{fontFamily: "Montserrat", fontWeight: "600", fontSize: "1.5rem"}}>Publish to</p> */}
                   <p className='text-center fw-bold fs-2 pt-3'>Publish</p>
                   <p style={{fontFamily: "Montserrat", fontWeight: "550", fontSize: "1rem"}}>Publish to</p>
                    {['Hashnode', 'Medium', 'Dev.to'].map((label) => (
                        <div key={`${label}`} className="mb-2">
                            <Form.Check
                                type="checkbox"
                                id={label}
                                label={label}
                                checked={checkedBoxes[label]}
                                onChange={() => handleCheckboxChange(label)}
                                className='black-checkbox'
                            />
                        </div>
                    ))}
                   <div
                    className='d-flex flex-column gap-2'
                   >
                    <Form.Control
                        placeholder='title'
                        value={ title }
                        onChange={(e) => setTitle(e.target.value)}
                        className='custom-input-group'
                      />
                      <Form.Control
                        placeholder='canonical URL (leave blank, if not)'
                        className='custom-input-group'
                        value={canonicalUrl}
                        onChange={(e) => setCanonicalUrl(e.target.value)}
                      />
                      {/* <Form.Control
                        as={"file"}
                        placeholder='cover image'
                      /> */}
                      {/* <Form.Group>
                        <Form.Label>Cover Image</Form.Label>
                        <Form.Control className='custom-file-input' type="file" />
                      </Form.Group> */}
                      <div className="custom-file">
                        {/* <label className="custom-file-label" htmlFor="customFile">
                            Choose Image
                        </label> */}
                        <p>Choose Image</p>
                        {/* <Form.Label className="custom-file-label">Cover Image</Form.Label>
                        <Form.Control 
                          type="file" 
                          className="custom-file-input" 
                          id="customFile" 
                        /> */}
                          <ButtonGroup toggle className='d-flex justify-content-center'>
                            <Button
                              variant={uploadType === 'upload' ? 'dark' : 'outline-dark'}
                              value="upload"
                              onClick={() => handleUploadTypeChange('upload')}
                            >
                              Upload Image
                            </Button>
                            <Button
                              variant={uploadType === 'link' ? 'dark' : 'outline-dark'}
                              value="link"
                              onClick={() => handleUploadTypeChange('link')}
                            >
                              Add Link
                            </Button>
                          </ButtonGroup>

                          {uploadType === 'upload' && (
                            <Form.Group controlId="customFile">
                              <Form.Label className="custom-file-label d-none">Select Image</Form.Label>
                              <Form.Control
                                type="file"
                                className="custom-file-input"
                                id="customFile"
                                onChange={handleImageChange}
                              />
                            </Form.Group>
                          )}

                          {uploadType === 'link' && (
                            <Form.Group controlId="imageLink">
                              <Form.Label className='d-none'>Image Link</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter image link"
                                value={imageLink}
                                onChange={handleLinkChange}
                              />
                            </Form.Group>
                          )}

                      </div>
                      <Form.Control as="textarea" 
                        value={description} 
                        placeholder='add text description'
                        rows={7} 
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <Form.Control
                        placeholder='series (add comma seperated values)'
                      />
                      <Form.Control
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder='tags (add comma seperated values)'
                      />
                   </div>
                </Modal.Body>
                <Modal.Footer >
                    <Button style={{
                            border: "1px solid black",
                            backgroundColor: "white",
                            color: "black",
                        }} onClick={closeModal}>
                        Close
                    </Button>
                    <Button variant="dark" type="submit">
                        Publish
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </div>
  )
}

export default PublishBlog