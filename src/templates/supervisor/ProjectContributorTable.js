
import {useState} from "react";
import {useEffect} from "react";

import {useLocation} from "react-router-dom";
import {Button, Table} from "react-bootstrap";

const ProjectContributorTable= () => {
    const [projectName, setProjectName] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [displayContributors, setDisplayContributors] = useState(false);
    const location = useLocation();
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const name = queryParams.get("projectName");
        if (name) {
            setProjectName(name);
        }
    }, [location]);
    useEffect(() => {
        if (!projectName) return;

        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/supervisor/getProjectStatus?repoName=${projectName}`, {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setUsers(result);
                setDisplayContributors(true);
            } catch (error) {
                console.error("Error fetching contributors:", error);
                setError("Failed to load contributors");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers()
    }, [projectName]);
    const resendMail = async (email) => {
        try {
            const response = await fetch(`/api/supervisor/resendEmail?email=${encodeURIComponent(email)}&projectName=${encodeURIComponent(projectName)}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to resend email");
            }

            const result = await response.text();
            if (result === "ok") {
                alert(`Email resent to ${email}`);
            }
        } catch (error) {
            console.error("Error resending email:", error);
            alert("An error occurred while resending the email.");
        }
    }
    return(
        <div className="main-page">
            <h2>Contributors for Project: {projectName}</h2>
            {loading && <p>Loading contributors...</p>}
            {error && <p>{error}</p>}
            {displayContributors && users.length > 0 && (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Signature Status</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                            <td>{user.email || "No Email Provided"}</td>
                            <td style={{color: user.signatureStatus === "User signed" ? "green" : "red", fontWeight: "bold",}}>
                                {user.signatureStatus}
                            </td>
                            <td className="p-1">{user.signatureStatus !== "User signed" && (
                                <Button variant="secondary" size="sm" onClick={() => resendMail(user.email, projectName)}>Resend email</Button>
                            )}</td>
                            </tr>
                            ))}
                    </tbody>
                </Table>
            )}
            {displayContributors && users.length === 0 && <p>No contributors found.</p>}
        </div>
    );
    }
export default ProjectContributorTable;
