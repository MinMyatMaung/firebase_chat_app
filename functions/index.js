const functions = require('firebase-functions');
const Filter = require('bad-words');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.detectEvilUsers = functions.firestore
  .document('messages/{msgId}')
  .onCreate(async (snap, ctx) => {
    const filter = new Filter();
    const { text, uid } = snap.data();

    if (filter.isProfane(text)) {
      const cleaned = filter.clean(text);
      
      // Update the message text to a censored version
      await snap.ref.update({
        text: `I got banned for saying... ${cleaned}`
      });

      // Add the user to a 'banned' collection
      await db.collection('banned').doc(uid).set({});
    }
  });
