const crypto = require("crypto");
const axios = require("axios");

// Authentication module
const auth = {
  // Function to get the authentication URL
  getUrl(_, res) {
    // Extracting necessary environment variables
    const { CLIENT_ID, REDIRECT_URI, SCOPE, CODE_VERIFIER } = process.env;

    // Creating a code challenge based on the code verifier
    const codeChallenge = crypto
      .createHash("sha256")
      .update(CODE_VERIFIER)
      .digest("base64")
      .replace(/[^a-zA-Z0-9]/g, ""); // Remove all non-alphanumeric characters

    // Constructing the authentication URL
    const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&response_type=code&client_id=${CLIENT_ID}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    // Sending the URL as a JSON response
    res.status(200).json({ url });
  },

  // Function to exchange the authorization code for access token
  async getAccess(req, res) {
    // Extracting necessary environment variables and request body
    const {
      CLIENT_ID: client_id,
      CLIENT_SECRET: client_secret,
      REDIRECT_URI: redirect_uri,
      CODE_VERIFIER: code_verifier,
    } = process.env;
    const { code } = req.body;

    try {
      // Requesting access token from Google OAuth API
      const response1 = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          code,
          client_id,
          client_secret,
          redirect_uri,
          code_verifier, // Google will use SHA-256 to hash the code verifier and check if it matches with the code challenge (CSRF protection)
          grant_type: "authorization_code",
        },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      // Handling non-200 response status
      if (response1.status !== 200) throw new Error();

      // Extracting access token from response
      const { access_token: accessToken } = response1.data;

      // Requesting user information from Google API using access token
      const response2 = await axios.get(
        "https://openidconnect.googleapis.com/v1/userinfo",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Handling non-200 response status
      if (response2.status !== 200) throw new Error();

      // Extracting user information from response
      const userInfos = response2.data;

      // Storing user information and access token in session
      req.session.user = { ...userInfos, accessToken }; // Access token authorizes access to Google API

      // Sending user information as JSON response
      res.status(200).json({ user: userInfos });
    } catch (error) {
      // Handling errors
      console.log(error);
      res.sendStatus(401); // Unauthorized status
    }
  },
};

// Exporting authentication module
module.exports = auth;
