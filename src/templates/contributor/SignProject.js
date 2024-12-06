import '../../App.css';

import {useEffect, useState} from "react";
import {Button, InputGroup} from "react-bootstrap";
import React from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";


const SignProject = () => {
    const [hashInput, setHashInput] = useState("");
    const [project, setProject] = useState(null); // For project files only
    const [token, setToken] = useState(null);
    const [message, setMessage] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false); // Token validation

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get("token");
        if (!tokenFromUrl) {
            setMessage("No token provided in the URL.");
            return;
        }
        setToken(tokenFromUrl);
        axios
            .get(`/api/contributor?token=${tokenFromUrl}`)
            .then((response) => {
                setMessage(response.data);
                setIsValidToken(true);
            })
            .catch((error) => {
                setMessage(error.response?.data || "Failed to validate token.");
                setIsValidToken(false);
            });
    }, []);

    const handleHashChange = (event) => {
        setHashInput(event.target.value);
    };

    const verifyHash = async () => {
        if (!hashInput && isValidToken) {
            alert("Please enter a hash value.");
            return;
        }

        try {
            const response = await fetch(`/api/contributor/verifyFileHash?token=${token}&hash=${hashInput}`, {
                method: "GET",
            });

            const result = await response.text();

            if (response.ok) {
                setMessage(result);
                setIsVerified(true);
            } else {
                setMessage("Error: " + result);
                setIsVerified(false);
            }
        } catch (error) {
            console.error("Error verifying hash:", error);
            setMessage("An error occurred while verifying the hash.");
            setIsVerified(false);
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setProject(selectedFile);
        } else {
            alert("Please select the project.");
            event.target.value = null;
        }
    };

    const verifySignature = async () => {
        if (!token || !project) {
            alert("Please select a project file.");
            return;
        }

        const formData = new FormData();
        formData.append("token", token);

        try {
            const response = await fetch("/api/contributor/verifySignature", {
                method: "POST",
                body: formData,
            });

            const result = await response.text();

            if (response.ok) {
                setMessage(result);
            } else {
                setMessage("Error: " + result);
            }
        } catch (error) {
            console.error("Error verifying signature:", error);
        }
    };

    const handleSubmit = async () => {
        if (!token || !project) {
            alert("Please select a project file.");
            return;
        }

        const formData = new FormData();
        formData.append("token", token);
        formData.append("project", project);

        try {
            const response = await fetch("/api/contributor/signProject", {
                method: "POST",
                body: formData,
            });

            const result = await response.text();

            if (response.ok) {
                setMessage(result);
            } else {
                setMessage("Error: " + result);
            }
        } catch (error) {
            console.error("Error uploading project file:", error);
        }
    };

    const handleDownload = () => {
        if (!isVerified) {
            setMessage("Token validation failed. Cannot download file.");
            return;
        }

        axios
            .get(`/api/contributor/downloadFile?token=${token}`, { responseType: "blob" })
            .then((response) => {
                const contentDisposition = response.headers["content-disposition"];
                const filename = contentDisposition
                    ? contentDisposition.split("filename=")[1].replace(/['"]/g, "") // Extract filename
                    : "downloaded_file.zip"; // Default filename

                // Create a Blob and a download link
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
                setMessage("Download started.");
            })
            .catch((error) => {
                setMessage(error.response?.data?.message || "Failed to download file.");
            });
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Sign and Download Project</h1>

            <h5>Enter the hash value to verify the file:</h5>
            <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Enter hash value"
                    value={hashInput}
                    onChange={handleHashChange}
                />
                <Button variant="primary" onClick={verifyHash} disabled={!isValidToken}>
                    Verify Hash
                </Button>
            </InputGroup>
            <div className="mb-3">
                <Button
                    variant="primary"
                    onClick={handleDownload}
                    style={{ marginTop: "20px" }}
                    disabled={!isVerified}
                >
                    Download Project
                </Button>
            </div>

            <h5 >Select the project to sign it</h5>
            <div>
                <p>Project file (.zip)</p>
                <InputGroup className="mb-3">
                    <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        disabled={!isVerified}
                    />
                </InputGroup>
            </div>
            <div>
                <Button
                    variant="primary"
                    className="mb-3"
                    onClick={handleSubmit}
                    disabled={!isVerified}
                >
                    Sign Project
                </Button>
            </div>
            <div>
                <Button variant="primary" onClick={verifySignature} disabled={!isVerified}>
                    Verify Signature
                </Button>
            </div>

            {message && (
                <div style={{ marginTop: "20px", color: isVerified ? "green" : "red" }}>
                    <h5>
                        <strong>Response:</strong> {message}
                    </h5>
                </div>
            )}
        </div>
    );

}
export default SignProject;
