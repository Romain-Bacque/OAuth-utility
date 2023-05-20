import { useEffect } from "react";
import loader from "../assets/loader.svg";

// Style
const containerStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%)",
  zIndex: 3,
  width: 100,
};
const imageStyle = {
  width: "100%",
};

// Page
const Connect = () => {
  useEffect(() => {
    // get the URL parameters which will include the auth token
    const params = window.location.search;

    if (window.opener) {
      // send them to the opening window
      window.opener.postMessage(params);
      // close the popup
      window.close();
    }
  }, []);

  return (
    <div style={containerStyle}>
      <img style={imageStyle} alt="loader image" src={loader} />
    </div>
  );
};

export default Connect;
