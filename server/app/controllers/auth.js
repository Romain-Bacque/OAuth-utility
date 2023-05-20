const crypto = require("crypto");
const axios = require("axios");

const auth = {
  getUrl(_, res) {
    const { CLIENT_ID, REDIRECT_URI, SCOPE, CODE_VERIFIER } = process.env;

    const codeChallenge = crypto
      .createHash("sha256")
      .update(CODE_VERIFIER)
      .digest("base64")
      .replace(/[^a-zA-Z0-9]/g, ""); // remove all non alphanumeric chars

    const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&response_type=code&client_id=${CLIENT_ID}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    res.status(200).json({ url });
  },
  async getAccess(req, res) {
    const {
      CLIENT_ID: client_id,
      CLIENT_SECRET: client_secret,
      REDIRECT_URI: redirect_uri,
      CODE_VERIFIER: code_verifier,
    } = process.env;
    const { code } = req.body;

    try {
      const response1 = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          code,
          client_id,
          client_secret,
          redirect_uri,
          code_verifier, // google will use algo SHA-256 to hash the code verifier and check if it matches with the code challenge (CSRF protection)
          grant_type: "authorization_code",
        },
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      if (response1.status !== 200) throw new Error();

      const { access_token: accessToken } = response1.data;

      const response2 = await axios.get(
        "https://openidconnect.googleapis.com/v1/userinfo",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response2.status !== 200) throw new Error();

      const userInfos = response2.data;

      req.session.user = {...userInfos, accessToken}; // access token authorize access to Google API

      res.status(200).json({ user: userInfos });
    } catch (error) {
      console.log(error);
      res.sendStatus(401);
    }
  },
};

module.exports = auth;
