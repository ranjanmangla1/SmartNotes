import React from "react"
import ReactMde from "react-mde"
// const ReactMde = R.default
import Showdown from "showdown"
import PublishBlog from "./PublishBlog";
// import { useRef } from "react";

export default function Editor({ tempNoteText, setTempNoteText, editorTitle, setEditorTitle }) {
    const [selectedTab, setSelectedTab] = React.useState("write")

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true,
    })  

    return (
        <section className="pane editor">
            <div className="d-flex flex-column">
                <input type="text" placeholder="Enter Title" 
                    value={editorTitle}
                    className="title-input"
                    style={{
                        border: "none",
                        height: "60px",
                        width: '100%'
                    }}
                    onChange={(e) => setEditorTitle(e.target.value)}
                />
                <ReactMde
                    value={tempNoteText}
                    onChange={setTempNoteText}
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    generateMarkdownPreview={(markdown) =>
                        Promise.resolve(converter.makeHtml(markdown))
                    }
                    minEditorHeight={67}
                    heightUnits="vh"
                />
                <PublishBlog />
            </div>
        </section>
    )
}
