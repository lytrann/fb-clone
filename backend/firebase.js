
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

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)

});


const db = getFirestore();

console.log('1')
app.use(bodyparser.json())
console.log('2')
app.use(cors())
console.log('3')
app.use(bodyparser.urlencoded({extended: true}));
console.log('4')

console.log('5')
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
                data: doc.data(),
                id: doc.id
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})