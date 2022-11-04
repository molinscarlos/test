const SentenceService = require('../services/service.sentences');

module.exports = {
  async getMainView(req, res) {
    const params = req.params;
    const page = params.page ? params.page : 1;
    let sentences = await SentenceService.getList(page, 'text', 'asc');
    const totalSentences = await SentenceService.getCountSentences();
    const pages = Math.ceil(totalSentences / 10);
    return res.render('./main', {
      sentences: sentences,
      pages: pages,
    });
  },
  async getSentenceView(req, res) {
    const params = req.params;
    const id = params.id ? params.id : '';
    let sentence = {
      id: '',
      text: '',
      cats: [],
    };
    if (id) {
      sentence = await SentenceService.getSentence(id);
    }
    return res.render('./sentence', {
      sentence: sentence,
      cats: [
        'responsibility',
        'benefit',
        'none',
        'education',
        'experience',
        'soft',
        'tech',
      ],
    });
  },
};
