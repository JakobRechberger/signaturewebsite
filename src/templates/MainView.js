
import React from "react";
import {Button} from "react-bootstrap";

const MainView = () => {
    return (
        <>
            <div className="main-page">
            <div>
                <Button variant="primary" href="/supervisor" className="mb-3">Go to Supervisor View</Button>
            </div>
            <div>
                <Button variant="primary" href="/contributor">Go to Contributor View</Button>
            </div>
            </div>
            </>
    );
}


export default MainView;
