const port = 8080
const cors = require('cors')
const {initializeApp, applicationDefault, cert} = require('firebase-admin/app');
const {getFirestore, Timestamp, FieldValue} = require('firebase-admin/firestore');
const express = require('express')
const bodyparser = require('body-parser');
const app = express()


const firebaseConfig = {
    apiKey: "AIzaSyAs2ybZvSti2yH55rKUXc93v8C_CTlIqNU",
    authDomain: "fb-clone-8d450.firebaseapp.com",
    projectId: "fb-clone-8d450",
    storageBucket: "fb-clone-8d450.appspot.com",
    messagingSenderId: "293598944339",
    appId: "1:293598944339:web:cc2aa51bbf2317eb6f3aa6",
    measurementId: "G-H5PG98L421"
};
var admin = require("firebase-admin");
const serviceAccount = require('./fb-clone-8d450-firebase-adminsdk-qzatp-590d6bc3b8.json');
const {useNavigate} = require("react-router-dom");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)

});


const db = getFirestore();

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;

}

app.use(bodyparser.json())

app.use(cors())

app.use(bodyparser.urlencoded({extended: true}));

console.log('firestore initiated')

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/posts', (req, res) => {
    console.log('here 0')

    async function getdata() {
        console.log('here 1')
        const snapshot = await db.collection('post').get();
        console.log('here 2')
        let allposts = Array();
        console.log('here 3')
        snapshot.forEach((doc) => {
            console.log({doc})
            const data_object = {
                data: doc.data(), id: doc.id
            }
            console.log(data_object)
            allposts.push(data_object);
        })
        console.log('here 4')
        res.send(JSON.stringify(allposts))
        console.log(allposts)

    }

    getdata()
})

app.post('/newpost', (req, res) => {
    const docRef = db.collection('post').doc(makeid(20));

    async function retrieve() {
        await docRef.set({
            'content': req.body.content, 'likeno': 0, 'cmtno': 0, 'shareno': 0

        })
    }

    retrieve()
    res.send(JSON.stringify("post created"))
})

app.post('/updatelike', async (req, res) => {
    console.log('data received: ' + req.body)
    const docRef = db.collection('post').doc(req.body.id);
    const likecount = req.body.data.likeno + 1
    console.log('new like count: ' + likecount)
    const doc = await docRef.get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        console.log('Document data: ', doc.data());
        console.log(typeof doc.data());
        const update = await docRef.update({likeno: likecount});
        console.log('updated ', update)

    }
    res.send(JSON.stringify("done"))
})

app.post('/deletepost', async (req, res) => {

    const docRef = db.collection('post').doc(req.body.id);

    const doc = await docRef.get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        console.log('Document data: ', doc.data());
        console.log(typeof doc.data());
        const resp = docRef.delete();
        res.send(JSON.stringify(req.body.id))

    }


})

app.get('/example_data', (req, res) => {
    res.send(JSON.stringify([{
        name: 'Thịt xiên nướng', image: 'skewer.jpeg', description: 'Juicy meat', price: 5000
    }, {
        name: 'Xúc xích', image: 'hotdog.jpeg', description: 'Juicy meat', price: 3000
    }, {
        name: 'Thịt chó', image: 'dog.jpg', description: 'Juicy meat', price: 2000
    }]))
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})