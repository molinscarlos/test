const SentenceService = require('../services/service.sentences');

module.exports = {
  async addSentence(req, res) {
    try {
      const body = req.body;
      let keys = Object.keys(body);
      let sentence = {};
      let cats = [];
      for (const k of keys) {
        if (k === 'sentence_text') {
          sentence.text = body[k];
        } else if (k === 'sentence_id') {
          sentence.id = body[k];
        } else {
          cats.push(body[k]);
        }
      }
      sentence.cats = cats;
      if (sentence.id) {
        let data = await SentenceService.updateSentence(sentence);
      } else {
        let data = await SentenceService.addSentence(sentence);
      }
      res.redirect('/');
    } catch (error) {
      console.log('--------', error);
      res.redirect('/');
    }
  },
  async deleteSentence(req, res) {
    const params = req.params;
    await SentenceService.deleteSentence(params.id);
    res.redirect('/');
  },
};
