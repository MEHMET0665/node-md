/*** Required External Modules */
const express = require('express')
const app = express()
const port = 3000
const bodyParser=require('body-parser')
const MongoClient = require('mongodb').MongoClient
app.use(express.static('public'))

// app.use(bodyParser.urlencoded({ extended: true }))




/*** App Variables and configuration*/
// app.get('/', (req, res) => res.send('Hello World!'))
// app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html')})


/** Database Connection with request handlers*/


// app.post('/quotes', (req, res) => {

//       console.log(req.body)
  
// })

const connectionString='mongodb+srv://<user>:<password>Q@cluster0.5uqz0.mongodb.net/mehmetQoutes?retryWrites=true&w=majority'
app.set('view engine','pug')
// MongoClient.connect(connectionString, (err, client) => {
//   console.log('hello mongo')
// })
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('Qoutes')
    // const collection = client.db("test").collection("devices");
    const quotesCollection = db.collection('colQoutes') 
    app.use(bodyParser.urlencoded({ extended: true }))
    // app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html')})
    app.use(bodyParser.json())


    app.get('/', (req, res) => {
      quotesCollection.find().toArray()
        .then(results => {
          console.log(results)

          res.render('index',{ quotes: results })
        })
        .catch(error => console.error(error))
      // ...
    })
    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
         res.redirect('/')
        })
        .catch(error => console.error(error))
    })
    
    app.put('/quotes', (req, res) => {console.log('put')
      quotesCollection.findOneAndUpdate(
        { name: 'kars' },		// write it manually from your quotes
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
      .then(result => {
        res.json('Success')
       })
        .catch(error => console.error(error))
    })
    ////
    app.delete('/quotes', (req, res) => {console.log('put')
    quotesCollection.deleteOne(
     
        
    
        { name: req.body.name},		// write it manually from your quotes
        
        {
          upsert: true
        }
      )
      .then(result => {
        res.json('Success')
       })
        .catch(error => console.error(error))
    })
    ////
app.listen(port, () => console.log(`Example app listening on port port!`))



  })
  .catch(error => console.error(error))


