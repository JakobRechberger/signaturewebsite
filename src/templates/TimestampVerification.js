import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import {Button, InputGroup} from "react-bootstrap";
import '../App.css';

const TimestampVerification = () => {
    const [file1, setFile1] = useState(null); // For any file type
    const [file2, setFile2] = useState(null); // For .tsr files only
    const [responseMessage, setResponseMessage] = useState("");

    const handleFile1Change = (event) => {
        const selectedFile = event.target.files[0];
        setFile1(selectedFile);
    };
    const handleFile2Change = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.name.endsWith('.tsr')) {
            setFile2(selectedFile);
        } else {
            alert("Please select a file with the .tsr extension for the second file.");
            event.target.value = null;
        }
    };
    const handleSubmit = async () => {
        if (!file1 || !file2) {
            alert("Please select both files.");
            return;
        }

        const formData = new FormData();
        formData.append("file1", file1);
        formData.append("file2", file2);

        try {
            const response = await fetch("http://localhost:8080/api/verify", {
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
            console.error("Error uploading files:", error);
        }
    };
return (
    <>
        <div className="second">
            <h5>Select the timestamped file and the timestamp (filename_timestamp.tsr) to verify this file </h5>
            <div>
                <p>First File (any type):</p>
                <InputGroup className="mb-3">
                    <Form.Control
                        type="file" onChange={handleFile1Change}
                    />
                </InputGroup>
            </div>
            <div>
                <p>Second File (.tsr only): </p>
                <InputGroup className="mb-3">
                    <Form.Control
                        type="file" onChange={handleFile2Change} accept=".tsr"
                    />
                </InputGroup>
            </div>
            <Button variant="primary" onClick={handleSubmit}>Verify Timestamp</Button>
            {responseMessage && (
                <div style={{ marginTop: "20px", color: "green" }}>
                    <h5><strong>Response:</strong> {responseMessage} </h5>
                </div>
            )}
        </div>
    </>
);
};

export default TimestampVerification;
