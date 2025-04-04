import {useState} from "react";
import {Button, Image, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React from "react";

const ProjectSelector = () => {
    const [repoUrl, setRepoUrl] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [startDate, setStartDate] = useState("");
    const [executeTest, setExecuteTest] = useState(false);
    const today = new Date().toISOString().substr(0, 10);
    const [endDate, setEndDate] = useState(today);
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };
    const handleExecuteTestChange = (event) => {
        setExecuteTest(event.target.checked);
    };

    const handleInputChange = (event) => {
        setRepoUrl(event.target.value);
    };
    const renderTooltip = (props) => (
        <Tooltip id="info-tooltip" {...props}>
            Execute all tests in the test folder of the specified repository. (Builds the project and adds test reports -> similar to CI pipeline)
        </Tooltip>
    );
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
            formData.append("executeTests", executeTest);

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
                <h3>Initiate Process</h3>
                <p style={{marginBottom:"10px",}}>Enter a Git Repository URL for Validation Process</p>
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
                            <p style={{marginBottom:"10px",}}>Enter a start date to fetch contributors (ideally date of last audit)</p>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="date"
                                placeholder="Start Date"
                                value={startDate}
                                onChange={handleStartDateChange}
                            />
                        </InputGroup>
                        <p style={{marginBottom:"10px",}}>Enter an end date</p>
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
                    <div className="mb-3">
                        <div className=" d-flex align-items-center gap-1">
                            <p style={{marginBottom:0}}>Execute tests</p>
                            <OverlayTrigger placement="right" overlay={renderTooltip}>
                                <Image
                                    src="/question-svgrepo-com.svg"
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        cursor: 'pointer',
                                    }}
                                />
                            </OverlayTrigger>
                        </div>
                        <Form>
                            <div className="custom-switch-container">
                                <Form.Check
                                    type="checkbox"
                                    id="custom-switch"
                                    onChange={handleExecuteTestChange}
                                    checked={executeTest}
                                    className="big-switch"
                                />
                            </div>

                        </Form>
                    </div>
                    <Button variant="primary" className="mb-3" onClick={handleSubmit}>Start Process</Button>
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
