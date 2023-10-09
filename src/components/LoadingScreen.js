import React from 'react';
import PulseLoader from "react-spinners/PulseLoader";

const override = {
    display: "block",
    margin: "auto",
  };

//for when user (from auth) is still loading in
function LoadingScreen(props) {
    return (
        <div className="absolute z-10 bg-indigo-950 w-full h-full m-auto flex ">
            <PulseLoader color="#523eed" cssOverride={override}/>
        </div>
    );
}

export default LoadingScreen;