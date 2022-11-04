const extract = require('extract-json-from-string');
const firebase = require('../hooks/hook.firebase');
const fs = require('fs');
module.exports = {
  async loadSentences() {
    // take from repo and check timestamp?

    try {
      const content = fs.readFileSync('sentences.jsonl.txt', {
        encoding: 'utf8',
        flag: 'r',
      });
      const sentences = extract(content);
      for (const s of sentences) {
        let activeCats = [];
        const cats = Object.keys(s.cats);
        for (const c of cats) {
          if (s.cats[c] === 1) {
            activeCats.push(c);
          }
        }
        await firebase.addSentence({
          text: s.text,
          cats: activeCats,
        });
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  async getSentence(id) {
    return firebase.getSentence(id);
  },
  async getCountSentences() {
    return firebase.getCountSentences();
  },
  async getList(from, orderVar, order) {
    if (from > 1) {
      from = from * 10;
    }
    return firebase.getList(from, orderVar, order);
  },
  async addSentence(sentence) {
    return firebase.addSentence(sentence);
  },
  async updateSentence(sentence) {
    firebase.updateSentence(sentence);
  },
  async deleteSentence(id) {
    firebase.deleteSentence(id);
  },
};
