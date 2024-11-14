import React, { useState } from 'react';
import axios from 'axios';
import {Button, InputGroup} from "react-bootstrap";
import Form from 'react-bootstrap/Form';

const FileUpload = () => {
    const [file, setFile] = useState(null);

    // Handle file selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    const downloadTimestampFile = async () => {
        try {
            if (!file) {
                alert("Please select a file first!");
                return;
            }
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post("http://localhost:8080/api/timestamp", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: 'blob',
            });
            const contentDisposition = response.headers['content-disposition'];
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : 'timestamped_file.tsr';

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name+ '_' + filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    return (
        <>
        <h5>Select a file to timestamp this file with <a href={"https://freetsa.org/index_de.php"}>FreeTSA</a></h5>
        <div>
            <h5>Upload a File</h5>
            <InputGroup className="mb-3">
                <Form.Control
                    type="file" onChange={handleFileChange}
                />
            </InputGroup>
            <Button variant="primary" onClick={downloadTimestampFile}>Timestamp File</Button>
        </div>
        </>
    );
};

export default FileUpload;
