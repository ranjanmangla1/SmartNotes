import React, { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext';

const PublishBlog = ({ currentNoteText, currentNote }) => {
  const [open, setOpen] = useState(false);

  const [checkedBoxes, setCheckedBoxes] = useState({
    Hashnode: false,
    Medium: false,
    'Dev.to': false,
  });
  
//   const apiKey = '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';

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(checkedBoxes);

        if(checkedBoxes[Hashnode]) {
            console.log('posting blog on hashnode')
        }

        if (checkedBoxes['Dev.to']) {
            // Use Markdown format for content
            const body_markdown = currentNoteText;

            const article = {
              title: 'Why you should start blogging?',
              body_markdown, // Use the variable defined above
              tags: ['programming', 'javascript', 'blogging'],
              series: 'Self Improvement Series',
              published: true, // Set to true if you want to publish the article
              // Add user input for these properties
              main_image: "https://fastly.picsum.photos/id/8/5000/3333.jpg?hmac=OeG5ufhPYQBd6Rx1TAldAuF92lhCzAhKQKttGfawWuA", // Set to a valid image URL or null
              canonical_url: null, // Set to the original URL or null
              description: "importance of blogging", // Set to a short description or null
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
                title: 'Why you should start blogging?',
                content: currentNoteText,
                canonicalUrl: 'https://fastly.picsum.photos/id/8/5000/3333.jpg?hmac=OeG5ufhPYQBd6Rx1TAldAuF92lhCzAhKQKttGfawWuA',
                tags: ['technology', 'web', 'coding'],
              };
              
              fetch('http://localhost:3000/post-blog', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
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
                   <p style={{fontFamily: "Montserrat", fontWeight: "600", fontSize: "1.5rem"}}>Publish to</p>
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
                        className='custom-input-group'
                      />
                      <Form.Control
                        placeholder='canonical URL (leave blank, if not)'
                        className='custom-input-group'
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
                        <Form.Label className="custom-file-label">Cover Image</Form.Label>
                        <Form.Control type="file" className="custom-file-input" id="customFile" />
                      </div>
                      <Form.Control as="textarea" 
                        value={prompt} 
                        placeholder='add text description'
                        rows={7} 
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                      <Form.Control
                        placeholder='series (add comma seperated values)'
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