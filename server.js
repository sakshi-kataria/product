const express= require('express');
const app=express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json({ type: 'application/json' })) // support json encoded bodies

const port=process.env.port || 5000;

const stitch = require("mongodb-stitch")
const clientPromise = stitch.StitchClientFactory.create('demo-app-fcyxc');
var ObjectId = require('mongodb').ObjectID;
// app.use(express.json());

app.get('/api/products',(req,res) => {
  clientPromise.then(client => {
    const db = client.service('mongodb', 'mongodb-atlas').db('suventure');
    client.authenticate("anon").then(() =>
      db.collection('product').find({}).limit(100).execute()
    ).then(docs => {
      res.json(docs)
    }).catch(err => {
      console.log('error on view-product',err)
    });
  });
});

app.post('/api/products',(req, res) => {
  clientPromise.then(client => {
    const db = client.service('mongodb', 'mongodb-atlas').db('suventure');
    client.authenticate("anon").then(() =>
      db.collection('product').insertOne(req.body, function (err, post) {
       if (err) return console.log(err);
       //res.json(post);
      })
    ).then(docs => {
      res.json(docs)
    }).catch(err => {
      console.log('error on create-product',err)
    });
  });
});

app.patch('/api/products/:id',(req, res) => {
  clientPromise.then(client => {
    const db = client.service('mongodb', 'mongodb-atlas').db('suventure');
    client.authenticate("anon").then(() =>
      db.collection('product').updateOne({_id:ObjectId(req.params.id)},{$set:
        req.body}, function (err, post) {
          if (err) return console.log(err);
          // res.json(post);
      })
    ).then(docs => {
      res.send("updated")
    }).catch(err => {
      console.log('error on update-product',err)
    });
  });
});


app.delete('/api/products/:id',(req, res) => {
  clientPromise.then(client => {
    const db = client.service('mongodb', 'mongodb-atlas').db('suventure');
    client.authenticate("anon").then(() =>
      db.collection('product').deleteOne({_id:ObjectId(req.params.id)})
    ).then(docs => {
      res.send('deleted product')
    }).catch(err => {
      console.log('error on delete-product',err)
    });
  });
});

app.get('/api/products/:id',(req, res) => {
  clientPromise.then(client => {
    console.log("req.params.id",req.params.id);
    const db = client.service('mongodb', 'mongodb-atlas').db('suventure');
    client.authenticate("anon").then(() =>
      db.collection('product').findOne({_id:ObjectId(req.params.id)})
    ).then(docs => {
      res.send(docs)
    }).catch(err => {
    console.log('error on view-product',err)
    });
  });
});
app.listen(port, () => console.log(`Listening on port ${port}`));
