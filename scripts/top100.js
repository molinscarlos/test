const fb = require('firebase-admin');
const serviceAccount = require('../keys/serviceAccountKey.json');
fb.initializeApp({
  credential: fb.credential.cert(serviceAccount),
});

(async () => {
  console.log('\x1b[32m geting sentences... \x1b[0m');
  const db = fb.firestore();
  const sentencesSnapShot = await db.collection('sentences').get();
  let sentencesTexts = [];
  sentencesSnapShot.forEach((doc) => {
    sentencesTexts.push(doc.data().text);
  });
  let hashMap = {};
  console.log('\x1b[32m ordering words from sentences... \x1b[0m');
  for (const text of sentencesTexts) {
    const sentenceWords = text.split(' ');
    for (const word of sentenceWords) {
      if (hashMap[word]) {
        hashMap[word]++;
      } else {
        hashMap[word] = 1;
      }
    }
  }

  let arr = Object.entries(hashMap);

  arr.sort((a, b) => {
    return b[1] - a[1];
  });

  const result = arr.slice(0, 100);
  console.log('\x1b[32m', result, '\x1b[0m');
})();
