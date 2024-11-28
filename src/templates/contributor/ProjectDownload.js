import { useEffect, useState } from "react";
import axios from "axios";
import {Button} from "react-bootstrap";

const DownloadPage = () => {
    const [message, setMessage] = useState("");
    const [token, setToken] = useState(null);
    const [isButtonDisabled, setButtonDisabled] = useState(true);
    const [isValid, setIsValid] = useState(false);

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
                setIsValid(true);
                setButtonDisabled(false);
            })
            .catch((error) => {
                setMessage(error.response?.data || "Failed to validate token.");
                setIsValid(false);
            });
    }, []);

    const handleDownload = () => {
        if (!isValid) {
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
            <h1>Contributor Page</h1>
            <p>{message}</p>
                <Button variant="primary" onClick={handleDownload} style={{ marginTop: "20px" }} disabled={isButtonDisabled}>
                    Download File
                </Button>
        </div>
        );

};

export default DownloadPage;

