import axios from "axios";
import GoogleButton from "react-google-button";
import { useNavigate } from "react-router-dom";

const appHost = import.meta.env.VITE_HOST;
let newWindow = null;

const Login = () => {
  const navigate = useNavigate();

  const getUrl = async () => {
    const {
      data: { url },
    } = await axios.get("http://localhost:4000/auth/getUrl");

    return url;
  };

  const receiveMessage = (event) => {
    // Do we trust the sender of this message? (might be
    // different from what we originally opened, for example).
    if (event.origin !== appHost) {
      return;
    }

    const { data } = event;

    // if we trust the sender and the source is our popup
    // get the URL params
    const urlParams = new URLSearchParams(data);
    const code = urlParams.get("code");

    axios
      .post("http://localhost:4000/auth/getAccess", { code })
      .then((response) => {
        const { user } = response.data;
        // set user (user infos) in a state/store to handle the user session
        console.log(user);
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const redirectToUrl = async (event) => {
    event.preventDefault();

    let url = null;

    // remove any existing event listeners
    window.removeEventListener("message", receiveMessage);

    try {
      url = await getUrl();
    } catch (error) {
      console.error(error);
      return;
    }

    if (newWindow === null || newWindow.closed) {
      const popupWinWidth =
        window.screen.width <= 400 ? window.screen.width - 20 : 400;
      const popupWinHeight =
        window.screen.height <= 500 ? window.screen.height - 20 : 600;

      const top = (window.screen.height - popupWinHeight) / 2;
      const left = (window.screen.width + popupWinWidth) / 2;

      newWindow = window.open(
        url,
        "_blank",
        `width=${popupWinWidth}, height=${popupWinHeight}, left=${left}, top=${top}`
      );
      newWindow.focus();
    } else {
      newWindow.focus();
    }

    // add the listener for receiving a message from the popup
    window.addEventListener("message", (event) => receiveMessage(event), false);
  };

  return <GoogleButton style={{ margin: "auto" }} onClick={redirectToUrl} />;
};

export default Login;
