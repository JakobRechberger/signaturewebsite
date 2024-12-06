import {useState} from "react";
import {Button, InputGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React from "react";

const ProjectSelector = () => {
    const [repoUrl, setRepoUrl] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [startDate, setStartDate] = useState("");
    const today = new Date().toISOString().substr(0, 10);
    const [endDate, setEndDate] = useState(today);
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleInputChange = (event) => {
        setRepoUrl(event.target.value);
    };
    const handleSubmit = async () => {
        try {
            if (!repoUrl) {
                alert("Please enter a Git repository URL!");
                return;
            }
            const formData = new FormData();
            formData.append("repoUrl", repoUrl);
            formData.append("startDate", startDate);
            formData.append("endDate", endDate);

            const response = await fetch("http://localhost:8080/api/supervisor/initWorkflow", {
                method: "POST",
                body: formData,
            });
            const result = await response.text();
            if (response.ok) {
                setResponseMessage(result);
            } else {
                setResponseMessage("Error: " + result);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while processing the Git repository.");
        }
    };
        return (
            <>
                <h5>Enter a Git Repository URL for Validation Process</h5>
                <div>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Enter Git repository URL"
                            value={repoUrl}
                            onChange={handleInputChange}
                        />
                    </InputGroup>
                    <div className="date-input">
                        <div>
                            <p>Enter a start date to fetch contributors (ideally date of last audit)</p>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="date"
                                placeholder="Start Date"
                                value={startDate}
                                onChange={handleStartDateChange}
                            />
                        </InputGroup>
                        <p>Enter an end date</p>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="date"
                                placeholder="End Date"
                                value={endDate}
                                onChange={handleEndDateChange}
                            />
                        </InputGroup>
                        </div>
                    </div>
                    <Button variant="primary" className="mb-3" onClick={handleSubmit}>Fetch Contributors</Button>
                    {responseMessage && (
                        <div style={{ marginTop: "20px", color: "green" }}>
                            <h5>
                                <strong>Response:</strong>
                            </h5>
                            <ul>
                                {responseMessage.split("\n").map((line, index) => (
                                    <li key={index}>{line}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </>
    );
}
export default ProjectSelector;
