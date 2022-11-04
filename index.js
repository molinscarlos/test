const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const sentencesController = require('./controllers/controller.sentences');
const viewController = require('./controllers/controller.view');
const firebase = require('firebase-admin');
var bodyParser = require('body-parser');

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const serviceAccount = require('./keys/serviceAccountKey.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

app.set('view engine', 'ejs');

app.get('/', viewController.getMainView);
app.get('/:page', viewController.getMainView);
app.get('/view/sentence', viewController.getSentenceView);
app.get('/view/sentence/:id', viewController.getSentenceView);
app.post('/add/sentence', sentencesController.addSentence);
app.get('/delete/sentence/:id', sentencesController.deleteSentence);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
