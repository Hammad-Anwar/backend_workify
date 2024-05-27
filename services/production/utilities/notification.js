const admin = require("firebase-admin");
// Path to your service account key JSON file
const serviceAccount = require("./serviceAccountKey.json");

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function notify(message) {
  try {
    const response = await admin.messaging().send(message);
    console.log("Message sent successfully:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

module.exports = { notify };
