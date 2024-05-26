const admin = require("firebase-admin");
// Path to your service account key JSON file
const serviceAccount = require("./serviceAccountKey.json");

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function notify(message) {
  admin
    .messaging()
    .send(message)
    .then((response) => {
      res.status(200).json({
        message: "Message sent successfully",
        response: response,
      });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
}

module.exports = { notify };
