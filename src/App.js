
import NavbarSite from "./templates/navbar";

import FileUpload from "./templates/FileUpload";

import './App.css';
import TimestampVerification from "./templates/TimestampVerification";

function App() {

    return (
        <>
            <div>
                <NavbarSite />
                <div className={'main-page'}>
                    <FileUpload/>
                    <TimestampVerification/>
                </div>
            </div>


        </>
    );
}
export default App;
