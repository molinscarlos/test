const firebase = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

class FirebaseHook {
  async addSentence(sentence) {
    const db = firebase.firestore();
    const res = await db.collection('sentences').add({
      text: sentence.text,
      cats: sentence.cats,
    });
    const docRef = db.collection('documentCount').doc('count');
    const docData = await docRef.get();
    const total = docData.data().total;
    return docRef.update({
      total: total + 1,
    });
  }

  async updateSentence(sentence) {
    const db = firebase.firestore();
    const sentenceRef = db.collection('sentences').doc(sentence.id);
    await sentenceRef.update({
      text: sentence.text,
      cats: sentence.cats,
    });
  }
  async deleteSentence(id) {
    const db = firebase.firestore();
    await db.collection('sentences').doc(id).delete();
    const docRef = db.collection('documentCount').doc('count');
    const docData = await docRef.get();
    const total = docData.data().total;
    return docRef.update({
      total: total - 1,
    });
  }

  async getSentence(id) {
    const db = firebase.firestore();
    const sentenceRef = db.collection('sentences').doc(id);
    const doc = await sentenceRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      return { id: doc.id, ...doc.data() };
    }
  }

  async getList(from, orderVar, order) {
    const db = firebase.firestore();
    const sentenceRef = db
      .collection('sentences')
      .orderBy(orderVar, order)
      .startAt(from)
      .limit(10);
    const snapshotSentences = await sentenceRef.get();
    let sentences = [];
    snapshotSentences.forEach((doc) => {
      sentences.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return sentences;
  }

  async getCountSentences() {
    const db = firebase.firestore();
    const docRef = db.collection('documentCount').doc('count');
    const doc = await docRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      return doc.data().total;
    }
  }
}
module.exports = new FirebaseHook();
