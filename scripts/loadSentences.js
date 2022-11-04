const extract = require('extract-json-from-string');
const fs = require('fs');
const fb = require('firebase-admin');
const serviceAccount = require('../keys/serviceAccountKey.json');
fb.initializeApp({
  credential: fb.credential.cert(serviceAccount),
});

(async () => {
  console.log('\x1b[32m reading json document... \x1b[0m');
  const content = fs.readFileSync('sentences.jsonl.txt', {
    encoding: 'utf8',
    flag: 'r',
  });
  console.log(
    '\x1b[32m document readed, transforming string into sentences array...  \x1b[0m'
  );
  const sentences = extract(content);
  console.log(
    '\x1b[32m document transformed to an array of sentences, saving in firestore... \x1b[0m'
  );
  const cats = Object.keys(sentences[0].cats);
  const db = fb.firestore();
  const chunkSize = 400;
  for (let i = 0; i < sentences.length; i += chunkSize) {
    const chunkSentences = sentences.slice(i, i + chunkSize);
    const batch = db.batch();
    for (const s of chunkSentences) {
      let activeCats = [];
      for (const c of cats) {
        if (s.cats[c] === 1) {
          activeCats.push(c);
        }
      }
      const sentencesRef = db.collection('sentences').doc();
      batch.set(sentencesRef, {
        text: s.text,
        cats: activeCats,
      });
    }
    await batch.commit();
  }
  await db.collection('documentCount').doc('count').set({
    total: sentences.length,
  });
  console.log('\x1b[32m job finished \x1b[0m');
})();
