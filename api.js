//for API
const express= require('express')
const app= express()
const port= 2020

app.use(express.json())
//for Mongodb
const mongodb= require('mongodb')
const MongoClient= mongodb.MongoClient
const ObjectID= mongodb.ObjectID

const URL= "mongodb://127.0.0.1:27017"
const database= "jcland"

MongoClient.connect(URL, {useNewUrlParser:true}, (err, client)=>{
    if(err){
        return console.log(err)
    }
    //do something with mongodb
    const db= client.db(database)

    
    app.get('/user', (req,res)=>{
        // ambil value "name" dari user
        const data_name = (req.query.name)
         // get data by name
         db.collection('users').find({name: data_name}).toArray()
         .then((result) => {
             res.send(result)
             console.log(req.query.name)
         })
         // respon ke user
    })


    app.get('/userbyage', (req,res)=>{
        // ambil nilai "umur" dari user
        const data_age = parseInt(req.query.age)
         // get data by umur
         db.collection('users').find({age: data_age}).toArray()
         .then((result) => {
             res.send(result)
             console.log(req.query.age)
         })
         // respon ke user
    })

    app.get('/userbymarried', (req,res)=>{
        // ambil status "maried" dari user
        const data_married = (req.query.married=== 'true')
         // get data by umur
         db.collection('users').find({married: data_married}).toArray()
         .then((result) => {
             res.send(result)
             console.log(req.query.married)
         })
         // respon ke user
    })

    //mencari berdasarkan status dan umur
    app.get('/usermarried',(req, res)=>{
        const data_age= parseInt(req.query.age)
        const data_married = (req.query.married=== 'true')

    db.collection('users').find({
        age: data_age,
        married: data_married

        }).toArray()
        .then(result=>{
            res.send(result)
            console.log('Status '+req.query.married +', dan Umurnya'+ req.query.age)

        })
    })

    // Mengambil data berdasarkan rentang umur
    app.get('/usersrange', (req, res) => {
        // Batas umur terendah
        const data_age_min = parseInt(req.query.minimum)
        // Batas umur tertinggi
        const data_age_max = parseInt(req.query.maximum)

        db.collection('users').find({
            age: {
                $gt: data_age_min,
                $lt: data_age_max
            }
        }).toArray()
        .then(result => {
            res.send(result)
            console.log(req.query.age)
        })

    })

    //get by umur
    app.get('/users/:umur', (req, res)=>{
        const data_age= parseInt(req.params.umur)
        db.collection('users').find({
            age: data_age
        }).toArray()
        .then(result=>{
            res.send({
                message: "Data berhasil ditemukan",
                data: result
            })
        })
    })





    

    app.post('/inputsatudata',(req,res)=>{
        //ambil data dari user
        const data_name= req.body.name
        const data_age= req.body.age
        const data_married= req.body.married
        //post ke database
        db.collection('users').insertOne({
            name: data_name,
            age: data_age,
            married: data_married
        }).then((result=>{
            res.send(result)
            console.log('ini dari insertone')
        }))
    })

     // Input banyak users
     app.post('/inputbanyakusers', (req, res)=> {
        // Baca data dari users
        const data = req.body.data // Array

        // Post ke database
        db.collection('users').insertMany(data)
        .then(result => {
            res.send(result.ops)
        })
    })

    //delete satu user
    app.delete('/users/:user_id', (req, res)=>{
        const user_id= req.params.user_id

        db.collection('users').deleteOne({
            _id: new ObjectID(user_id)
        }).then(result=>{
            res.send(result)
            console.log()
        })
    })

  
    // edit satu user berdasarkan id object
    app.patch('/users/:user_id', (req, res ) => {
        const user_id = req.params.user_id
        const user_name = req.query.name

        db.collection('users').updateOne({
            // Cari user berdasarkan id
            _id: new ObjectID(user_id)
        }, {
            // Update data (nama)
            $set: {
               name: user_name
            }
        }).then(result => {
            // respon dari object result
            res.send(result)
        })
    })


    
    //end of function
})

app.listen(port, ()=>{
    console.log('API Berhasil running di port '+ port)
})

