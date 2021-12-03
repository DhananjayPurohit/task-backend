const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require("cors");
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser());

app.listen(process.env.PORT || 8080, () => {
    console.log('listening on 8080')
});

const connectionString = 'mongodb+srv://dbuser:dbuser@cluster0.t8txc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        const db = client.db('repoInfo');
        const repoListCollection = db.collection('repoList');

        app.get('/', (req, res) => {
            repoListCollection.find().toArray()
                .then(results => {
                    res.send(results);
                })
                .catch(error => console.error(error))
        })

        app.post('/addRepo', (req, res) => {
            repoListCollection.insertOne(req.body)
                .then(result => {
                    console.log(result)
                })
                .catch(error => console.error(error))
        });

        app.delete('/deleteRepo', (req, res) => {
            repoListCollection.findOneAndDelete({ full_name: req.body.full_name })
                .then(result => {
                    console.log(result)
                })
                .catch(error => console.error(error))
        });
    })
    .catch(error => console.error(error));