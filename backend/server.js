const port = 8080
const cors = require('cors')
const {initializeApp, applicationDefault, cert,} = require('firebase-admin/app');
const {getFirestore, Timestamp, FieldValue} = require('firebase-admin/firestore');
const express = require('express')
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
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
let admin = require("firebase-admin");
const serviceAccount = require('./fb-clone-8d450-firebase-adminsdk-qzatp-590d6bc3b8.json');
const {useNavigate} = require("react-router-dom");


initializeApp({
    credential: admin.credential.cert(serviceAccount)

});


const db = getFirestore();

function makeid(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;

}

app.use(cookieParser());

app.use(bodyParser.json())

app.use(cors())

app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {

    res.send('Hello World!')
})

app.get('/posts', (req, res) => {


    async function getdata() {

        const snapshot = await db.collection('post').get();

        let allposts = Array();

        snapshot.forEach((doc) => {
            const data_object = {
                data: doc.data(), id: doc.id
            }
            allposts.push(data_object);
        })

        res.send(JSON.stringify(allposts))


    }

    getdata()
})

app.post('/createpost', (req, res) => {
    const docRef = db.collection('post').doc(makeid(20));

    async function retrieve() {
        await docRef.set({
            'content': req.body.content, 'likeno': 0, 'cmtno': 0, 'shareno': 0

        })
    }

    retrieve()
    res.send(JSON.stringify("post created"))
})
app.post('/newuser', async (req, res) => {

    const usersRef = db.collection('users')
    const id = usersRef.doc(makeid(20));
    const emailRef = await usersRef.where('email', '==', req.body.email).get();
    const nameRef = await usersRef.where('name', '==', req.body.name).get();
    if (!emailRef.empty || !nameRef.empty) {
        console.log(emailRef, nameRef);
        res.send(JSON.stringify('user already exists, log in? '))
    } else {
        id.set({
            'name': req.body.name, 'email': req.body.email, 'password': req.body.password
        })
            .then(res.send(JSON.stringify('user created')))
    }

})

function checkLogin(doc, req, res, next) {
    const password = doc.get("password")
    console.log('password: ', password)
    console.log('input: ', req.body.password);
    if (password === req.body.password) {
        var cookie = req.cookies.sid
        console.log(req.cookies.sid);
        if (cookie === undefined) {

            let sid = makeid(30)
            const timestamp = Timestamp.fromMillis(Date.now())
            console.log(sid, ' ', timestamp)
            const docRef = db.collection('sessions').doc(sid);
            docRef.set({
                'userID': doc.id, 'created': timestamp
            })
            res.cookie("session_ID", sid, {domain: 'http://127.0.0.1:5173'})
            // console.log(document.cookie);
            res.send(JSON.stringify("OK", sid))
        } else {

            console.log('cookie exists', cookie);
        }
        next();

        app.use(express.static(__dirname + '/public'));

    } else {
        res.send(JSON.stringify("wrong password"));
    }
}

app.post('/olduser', async (req, res, next) => {

        const usersRef = db.collection('users')
        const nameRef = await usersRef.where('email', '==', req.body.username).get();
        const emailRef = await usersRef.where('name', '==', req.body.username).get();

        console.log('request received')
        if (nameRef.empty && emailRef.empty) {
            console.log('no user');
            res.send(JSON.stringify("user does not exist, sign up?"))
        } else {
            if (emailRef.empty) {
                nameRef.forEach(doc => checkLogin(doc, req, res, next))
            } else {
                emailRef.forEach(doc => checkLogin(doc, req, res, next))
            }

        }
    }
)


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
        docRef.delete();
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