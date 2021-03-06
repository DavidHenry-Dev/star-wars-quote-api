const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const req = require('express/lib/request')
const MongoClient = require('mongodb').MongoClient


console.log('May the Node be with you')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(bodyParser.json())

MongoClient.connect('mongodb+srv://David:Maiden5147@cluster0.nekkolb.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')
   
   
    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          console.log(result)
          res.redirect('/')
        })
        
    })

    app.get('/', (req, res) => {
     db.collection('quotes').find().toArray()
        .then(results => {
          res.render('index.ejs', { quotes: results})
        })
        .catch(error => console.error(error))
        
    })

    app.put('/quotes', (req, res) => {
      console.log(req.body)
      
      quotesCollection.findOneAndUpdate(
        { name: 'Yoda'},
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

    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
      .then(result => {
        if (result.deletedCount === 0) {
          return res.json('No quote to delete')
        }
        res.json(`Deleted Darth Vader's quote`)
      })
        .catch(error => console.error(error))
    })

    app.listen(3000, () => {
      console.log('listening on 3000')
      })

      
    
})


