

import { Route, Routes } from 'react-router-dom';
import './App.css';
import React from "react";
import Misc from "./templates/Misc";
import SupervisorView from "./templates/supervisor/SupervisorView";
import ContributorView from "./templates/contributor/ContributorView";

import MainView from "./templates/MainView";
import ProjectContributorTable from "./templates/supervisor/ProjectContributorTable";

function App() {

    return (
        <>
            <Routes>
                {/* add other routes here. New routes before default route! Otherwise, it will always math '/' */}
                <Route path={'/supervisor'} element={<SupervisorView/>} />
                <Route path={'/contributor'} element={<ContributorView/>} />
                <Route path={'/supervisor/project_contributors'} element={<ProjectContributorTable/>} />
                <Route path={'/misc'} element={<Misc/>} />
                <Route path={'/'} element={<MainView/>} />
            </Routes>

            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
                integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
                crossOrigin="anonymous"
            />


        </>
    );
}
export default App;
