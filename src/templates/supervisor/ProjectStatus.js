import {useState} from "react";
import {Button, InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React from "react";
import { useNavigate } from 'react-router-dom';

const ProjectStatus = () => {

    const [projectName, setProjectName] = useState("");
    const navigate = useNavigate();


    const handleInputChange = (event) => {
        setProjectName(event.target.value);
    };
    const handleRedirect = () => {
        if (projectName.trim() !== "") {
            navigate(`/supervisor/project_contributors?projectName=${encodeURIComponent(projectName)}`);
        } else {
            alert("Please enter a project name");
        }
    };

    return (
        <>
        <div style={{marginTop: "10vh",}}>
            <hr></hr>
            <h3>Progress Monitoring</h3>
            <p style={{marginBottom:"10px",}}>Enter the project git name</p>
            <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Project name"
                    value={projectName}
                    onChange={handleInputChange}
                />
                <Button variant="primary" onClick={handleRedirect}>
                    Get Contributor Status
                </Button>
            </InputGroup>
        </div>
        </>
    )


}
export default ProjectStatus;
