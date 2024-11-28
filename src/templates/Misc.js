import FileUpload from "./FileUpload";
import TimestampVerification from "./TimestampVerification";
import React from "react";

const Misc = () => {
    return (
        <>
            <div>
                <div className={'main-page'}>
                    <FileUpload/>
                    <TimestampVerification/>
                </div>
            </div></>
    );
}


export default Misc;
