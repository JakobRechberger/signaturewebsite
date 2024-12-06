
import ProjectSelector from "./ProjectSelector";
import '../../App.css';
import ProjectStatus from "./ProjectStatus";

const SupervisorView = () => {
    return (
        <div className="main-page">
            <ProjectSelector />
            <ProjectStatus />
        </div>
    );
}
export default SupervisorView;
