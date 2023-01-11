const port = 8080;
const cors = require('cors');
const {initializeApp} = require('firebase-admin/app');
const {getFirestore, FieldValue, arrayUnion, arrayRemove} = require('firebase-admin/firestore');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
let admin = require("firebase-admin");
const serviceAccount = require('./fb-clone-8d450-firebase-adminsdk-qzatp-590d6bc3b8.json');
const multer = require('multer');
let fs = require('fs');
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public");
    }, filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}.${ext}`);
    }
});
const upload = multer({storage: multerStorage});
initializeApp({credential: admin.credential.cert(serviceAccount)});
const db = getFirestore();

function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result
}

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/getpics', express.static('public'));

app.get('/getfriend', async (req, res) => {
    const sessionRef = db.collection('sessions').doc(req.query.sid).get();
    const sessionData = (await sessionRef).data();
    const userID = await sessionData.userID

    async function retrieve() {
        const userRef = db.collection('users').doc(userID)
        const getUser = userRef.get()
        const userData = (await getUser).data();
        const friendList = userData.friends;
        const pendingRef = userRef.collection('pendingFriendReq')
        const getPending = await pendingRef.get()
        const sentRef = await userRef.collection('sentFriendReq')
        const getSent = await sentRef.get()
        const friendCheck = friendList.includes(req.query.user)
        if (friendCheck === true) {
            res.send(JSON.stringify('unfriend'))
        } else {
            if (!getPending.empty) {
                getPending.forEach(doc => {
                    if (doc.id === req.query.user) {
                        res.send(JSON.stringify('accept/reject request'))
                    } else {
                        res.send(JSON.stringify('error'))
                    }
                })
            } else {
                if (!getSent.empty) {
                    getSent.forEach(doc => {
                        if (doc.id === req.query.user) {
                            res.send(JSON.stringify('remove request'))
                        } else {
                            res.send(JSON.stringify('add friend'))
                        }
                    })
                } else {
                    res.send(JSON.stringify('add friend'))
                }
            }
        }
    }

    await retrieve();
});

app.post('/updatefriend', async (req, res) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const sessionRef = db.collection('sessions').doc(req.query.sid);
    const session = await sessionRef.get()
    if (!session.exists) {
        res.send(JSON.stringify('log in first'));
    } else {
        const sessionData = (await session).data();
        const expTime = sessionData.expires;
        if (currentTime > expTime) {
            res.send(JSON.stringify('log in first'));
        } else {
            const senderID = sessionData.userID
            const senderRef = await db.collection('users').doc(senderID)
            const getSender = await senderRef.get()
            const senderData = await getSender.data()
            let receiverRef = await db.collection('users')
                .where('name', '==', req.body.to).get()
            receiverRef.forEach(async doc => {
                const receiverID = doc.id
                const receiverData = doc.data()
                let receiverRequest = db.collection('users')
                    .doc(receiverID)
                    .collection('pendingFriendReq')
                    .doc(senderData.name)
                let senderRequest = db.collection('users')
                    .doc(senderID)
                    .collection('sentFriendReq')
                    .doc(receiverData.name)
                if (req.body.request === 'add friend') {
                    await receiverRequest.set({'timeStamp': Math.floor(Date.now() / 1000)})
                    await senderRequest.set({'timeStamp': Math.floor(Date.now() / 1000)})
                    res.send(JSON.stringify('request sent'))
                }
                if (req.body.request === 'remove request') {
                    await receiverRequest.delete();
                    await senderRequest.delete();
                    res.send(JSON.stringify('removed'))
                }
                let receiverRef = db.collection('users').doc(receiverID)
                if (req.body.request === 'unfriend') {
                    await senderRef.update({'friends': FieldValue.arrayRemove(receiverData.name)})
                    await receiverRef.update({'friends': FieldValue.arrayRemove(senderData.name)})
                    res.send(JSON.stringify('removed'))
                }
            })
        }
    }
});

app.post('/respondfriendreq', async (req, res) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const sessionRef = db.collection('sessions').doc(req.query.sid);
    const session = await sessionRef.get()
    if (!session.exists) {
        res.send(JSON.stringify('log in first'));
    } else {
        const sessionData = (await session).data();
        const expTime = sessionData.expires;
        if (currentTime > expTime) {
            res.send(JSON.stringify('log in first'));
        } else {
            const respID = sessionData.userID
            const respRef = await db.collection('users').doc(respID)
            const getResp = await respRef.get()
            const respData = await getResp.data()
            const senderRef = await db.collection('users')
                .where('name', '==', req.body.to).get()
            senderRef.forEach(doc => {
                const senderID = doc.id
                const senderData = doc.data()
                let senderRequest = db.collection('users')
                    .doc(senderID)
                    .collection('sentFriendReq')
                    .doc(respData.name)
                let respRequest = db.collection('users')
                    .doc(respID)
                    .collection('pendingFriendReq')
                    .doc(senderData.name)
                senderRequest.delete();
                respRequest.delete();
                if (req.body.request === 'accept') {
                    const respFriendRef = db.collection('users').doc(respID)
                    respFriendRef.update({'friends': FieldValue.arrayUnion(senderData.name)})
                    const senderFriendRef = db.collection('users').doc(senderID)
                    senderFriendRef.update({'friends': FieldValue.arrayUnion(respData.name)})
                    res.send(JSON.stringify('accepted'))
                } else {
                    res.send(JSON.stringify('rejected'))
                }
            })
        }
    }
});

app.post('/newuser', async (req, res) => {
    const usersRef = db.collection('users');
    const id = usersRef.doc(makeId(20));
    const emailRef = await usersRef.where('email', '==', req.body.email).get();
    const nameRef = await usersRef.where('name', '==', req.body.name).get();
    if (!emailRef.empty || !nameRef.empty) {
        res.send(JSON.stringify('user already exists, log in? '));
    } else {
        await id.set({
            'name': req.body.name, 'email': req.body.email, 'password': req.body.password, 'friends': []
        })
        res.send(JSON.stringify('user created'));

    }

});

app.get('/friendlist', async (req, res) => {
    const allFriends = Array();

    async function getData() {
        const userRef = db.collection('users').where('name', '==', req.query.user).get();
        (await userRef).forEach(async doc => {
            const userData = (await doc).data();
            const userFriends = await userData.friends
            allFriends.concat(userFriends)
            res.send(JSON.stringify(userFriends));
        })
    }

    getData();
});

app.get('/friendreqlist', async (req, res) => {
        const allFriends = Array();

        async function getData() {
            const userRef = await db
                .collection('users')
                .where('name', '==', req.query.user)
                .get();

            console.log({userRef})

            userRef.forEach(async doc => {
                const userID = doc.id;
                const FriendReqRef = await db
                    .collection('users')
                    .doc(userID).collection('pendingFriendReq')
                    .get();

                FriendReqRef.forEach(async doc => {
                    allFriends.push(doc.id)
                    console.log('1', allFriends);
                })
                console.log('2', allFriends);
                res.send(JSON.stringify(allFriends));
            })
        }

        getData();
    }
)
;

app.get('/posts', async (req, res) => {
    const allPosts = Array();

    async function getData() {
        const sessionRef = db.collection('sessions').doc(req.query.sid).get();
        const sessionData = (await sessionRef).data();
        const userID = await sessionData.userID
        const userRef = await db.collection('users').doc(userID)
        const getUser = await userRef.get()
        const userData = (await getUser).data();
        const friendList = userData.friends;
        const postRef = await db.collection('post')
            .where('creator', '==', userData.name).get();
        postRef.forEach(doc => {
            const dataObject = {data: doc.data(), id: doc.id};
            allPosts.push(dataObject);
        })
        if (friendList.length !== 0) {
            for (let i = 0; i < friendList.length; i++) {
                const friendRef = await db.collection('post')
                    .where('creator', '==', friendList[i]).get();
                friendRef.forEach(doc => {
                    const dataObject = {data: doc.data(), id: doc.id};
                    allPosts.push(dataObject);
                })

            }
        } else {

        }
    }

    await getData();
    await res.send(JSON.stringify(allPosts));
});

app.post('/createpost', async (req, res) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const sessionRef = db.collection('sessions').doc(req.query.sid);
    const session = await sessionRef.get()
    if (!session.exists) {
        res.send(JSON.stringify('log in first'));
    } else {
        const sessionData = (await session).data();
        const expTime = sessionData.expires;
        if (currentTime > expTime) {
            res.send(JSON.stringify('log in first'));
        } else {
            async function retrieve() {
                const docRef = db.collection('post').doc(makeId(20));
                await docRef.set({
                    'content': req.body.content,
                    'likeNo': 0,
                    'cmtNo': 0,
                    'shareNo': 0,
                    'timeStamp': Math.floor(Date.now() / 1000),
                    'creator': req.query.user,
                    'likedBy': [],
                });
            }

            await retrieve();
            res.send(JSON.stringify("post created"));
        }
    }
});


async function checkLogin(doc, req, res) {
    const password = doc.get("password");
    if (password === req.body.password) {
        const sid = makeId(20);
        const userName = doc.get("name");
        const docRef = db.collection('sessions').doc(sid);
        await docRef.set({
            'userID': doc.id,
            'created': Math.floor(Date.now() / 1000),
            'expires': Math.floor((Date.now() / 1000) + 1800)
        });
        res.send(JSON.stringify({
            loggedIn: true, sid: sid, user: userName
        }));
    } else {
        res.send(JSON.stringify("wrong password"));
    }
}

app.post('/olduser', async (req, res) => {
    const usersRef = db.collection('users');
    const nameRef = await usersRef.where('email', '==', req.body.username).get();
    const emailRef = await usersRef.where('name', '==', req.body.username).get();
    if (nameRef.empty && emailRef.empty) {
        res.send(JSON.stringify("user does not exist, sign up?"));
    } else {
        if (emailRef.empty) {
            nameRef.forEach(doc => checkLogin(doc, req, res));
        } else {
            emailRef.forEach(doc => checkLogin(doc, req, res));
        }

    }
});


app.post('/updatelike', async (req, res) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const sessionRef = db.collection('sessions').doc(req.query.sid);
    const session = await sessionRef.get()
    if (!session.exists) {
        res.send(JSON.stringify('log in first'));
    } else {
        const sessionData = (await session).data();
        const expTime = sessionData.expires;
        if (currentTime > expTime) {
            res.send(JSON.stringify('log in first'));
        } else {
            const userRef = db.collection('users').doc(sessionData.userID).get();
            const userData = (await userRef).data();
            const userName = userData.name;
            const docRef = db.collection('post').doc(req.body.id);
            let orgLikeCount = req.body.data.likeNo;
            const doc = await docRef.get();
            if (!doc.exists) {
                res.send(JSON.stringify('cannot find post'));
            } else {
                if (req.body.data.request === "like") {
                    const likeCount = orgLikeCount + 1;
                    console.log('i')
                    await docRef.update({likeNo: likeCount, likedBy: FieldValue.arrayUnion(userName)});
                    res.send(JSON.stringify("liked"));
                } else {
                    const likeCount = orgLikeCount - 1;
                    (console.log('ii'))
                    await docRef.update({likeNo: likeCount, likedBy: FieldValue.arrayRemove(userName)});
                    res.send(JSON.stringify("unliked"));
                }
            }
        }
    }
});

app.post('/deletepost', async (req, res) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const sessionRef = db.collection('sessions').doc(req.query.sid);
    const session = await sessionRef.get()
    if (!session.exists) {
        res.send(JSON.stringify('log in first'));
    } else {
        const sessionData = (await session).data();
        const expTime = sessionData.expires;
        if (currentTime > expTime) {
            res.send(JSON.stringify('log in first'));
        } else {
            const postRef = await db.collection('post').doc(req.body.id);
            const getPost = await postRef.get()
            const accessPost = getPost.data();
            const creator = accessPost.creator;
            if (creator === req.query.user) {
                if (!getPost.exists) {
                    res.send('No such document!');
                } else {
                    const commentRef = await db.collection('comments')
                        .where('postID', '==', req.body.id).get();
                    commentRef.forEach(doc => doc.ref.delete());
                    await postRef.delete();
                    res.send(JSON.stringify('deleted'));
                }
            } else {
                res.send(JSON.stringify('user unauthorised'));
            }
        }
    }
});

app.post("/postcmt", async (req, res) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const sessionRef = db.collection('sessions').doc(req.query.sid);
    const session = await sessionRef.get()
    if (!session.exists) {
        res.send(JSON.stringify('log in first'));
    } else {
        const sessionData = (await session).data();
        const expTime = sessionData.expires;
        if (currentTime > expTime) {
            res.send(JSON.stringify('log in first'));
        } else {
            async function retrieve() {
                const postID = req.body.postData.id;
                const postRef = db.collection('post').doc(postID);
                const cmt_id = makeId(20);
                const commentRef = db.collection('comments').doc(cmt_id);
                let orgCmtCount = req.body.postData.data.cmtNo;
                const cmt_data = {
                    'content': req.body.cmtData,
                    'commentor': req.query.user,
                    'postID': postID,
                    'likeNo': 0,
                    'timeStamp': Math.floor(Date.now() / 1000),
                };
                const cmtCount = orgCmtCount + 1;
                await postRef.update({'cmtNo': cmtCount});
                await commentRef.set(cmt_data);
                res.send(JSON.stringify({'data': cmt_data, 'id': cmt_id}));
            }

            await retrieve()

        }
    }
});


app.get("/getcmts", async (req, res) => {
    async function getData() {
        const loadCmt = await db.collection('comments');
        const cmtRef = await loadCmt.where('postID', '==', req.query.postID).get();
        if (!cmtRef.empty) {
            let allCmts = Array();
            cmtRef.forEach((doc) => {
                const dataObject = {data: doc.data(), id: doc.id};
                allCmts.push(dataObject);
            })
            res.send(JSON.stringify(allCmts));
        } else {
            res.send(JSON.stringify([]));
        }
    }

    await getData()
});

app.post('/deletecmt', async (req, res) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const sessionRef = db.collection('sessions').doc(req.query.sid);
    const session = await sessionRef.get()
    if (!session.exists) {
        res.send(JSON.stringify('log in first'));
    } else {
        const sessionData = (await session).data();
        const expTime = sessionData.expires;
        if (currentTime > expTime) {
            res.send(JSON.stringify('log in first'));
        } else {
            const cmtRef = await db.collection('comments').doc(req.body.cmtData.id).get();
            if (!cmtRef.exists) {
                res.send(JSON.stringify('delete failed'));
            } else {
                const accessCmt = cmtRef.data();
                const commentor = accessCmt.commentor;
                const postRef = await db.collection('post').doc(accessCmt.postID);
                const getPost = await postRef.get();
                const postData = await getPost.data();
                const orgCmtCount = await postData.cmtNo;
                const updatedCmtCount = orgCmtCount - 1;

                if (commentor === req.query.user) {
                    const docRef = db.collection('comments').doc(req.body.cmtData.id);
                    const doc = await docRef.get();
                    if (!doc.exists) {
                        res.send(JSON.stringify('delete failed'));
                    } else {
                        await docRef.delete();
                        await postRef.update({cmtNo: updatedCmtCount});
                        res.send(JSON.stringify({
                            'deleted': true, 'cmtID': req.body.cmtData.id, 'cmtNo': updatedCmtCount
                        }));
                    }
                } else {
                    res.send(JSON.stringify('user unauthorised'));
                }
            }
        }
    }
});


app.get('/userpost', async (req, res) => {
    async function getPost() {
        const postRef = await db.collection('post');
        const userPost = await postRef.where('creator', '==', req.query.user).get();
        const allPosts = Array();
        userPost.forEach((doc) => {
            const info = {
                data: doc.data(), id: doc.id
            }
            allPosts.push(info);
        })
        res.send(JSON.stringify(allPosts));
    }

    await getPost();
});

app.get('/profileinfo', async (req, res) => {
    async function getData() {
        const userRef = await db.collection('users');
        const userInfo = await userRef.where('name', '==', req.query.user).get();
        userInfo.forEach((doc) => {
            const allData = doc.data();
            res.send(JSON.stringify({
                'profilePic': allData.profilePic, 'bannerPic': allData.bannerPic, 'bio': allData.bio
            }));
        })

    }

    await getData()
});

app.post('/editpic', upload.any(), async (req, res) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const sessionRef = db.collection('sessions').doc(req.query.sid);
    const session = await sessionRef.get()
    if (!session.exists) {
        res.send(JSON.stringify('log in first'));
    } else {
        const sessionData = (await session).data();
        const expTime = sessionData.expires;
        if (currentTime > expTime) {
            res.send(JSON.stringify('log in first'));
        } else {
            const file = req.files[0];
            const ext = file.mimetype.split("/")[1];
            if (req.query.type === "banner-pic") {
                const userRef = db.collection('users').doc(sessionData.userID);
                await userRef.update({
                    'bannerPic': `${file.fieldname}.${ext}`
                });
                res.send(JSON.stringify('updated'));
            } else {
                const userRef = db.collection('users').doc(sessionData.userID);
                await userRef.update({
                    'profilePic': `${file.fieldname}.${ext}`
                });
                res.send(JSON.stringify('updated'));
            }
        }
    }
});

function deleteImage(path) {
    fs.unlinkSync(path)
}

app.post('/deletepic', async (req, res) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const sessionRef = db.collection('sessions').doc(req.query.sid);
    const session = await sessionRef.get()
    if (!session.exists) {
        res.send(JSON.stringify('log in first'));
    } else {
        const sessionData = (await session).data();
        const expTime = sessionData.expires;
        if (currentTime > expTime) {
            res.send(JSON.stringify('log in first'));
        } else {
            let path = `public/${req.query.pic}`
            deleteImage(path)
            let fileName = req.query.pic
            if (fileName.includes("banner") === true) {
                const userRef = db.collection('users').doc(sessionData.userID)
                await userRef.update({'bannerPic': FieldValue.delete()})
                res.send(JSON.stringify('deleted'))
            } else {
                const userRef = db.collection('users').doc(sessionData.userID)
                await userRef.update({'profilePic': FieldValue.delete()})
                res.send(JSON.stringify('deleted'))

            }
        }
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