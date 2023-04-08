const express = require('express')
const jwt = require ('jsonwebtoken')
const app = express()
// const dataTeacher = require('./data/teacher.json')
const users = require('./data/user.json')
app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.get('/api',(req,res)=>{
    res.send('Assigment 2')
})

app.post('/api/login',(req,res)=>{
    //auth user
    const { username, password } = req.body;
    const user = userVerify(username, password, users);
    if (!user) {
        return res.status(401).send("Invalid credentials");
      }
    const getAllData = require('./data/teacher.json');
    const token = jwt.sign({getAllData}, 'my_secret_key');
    res.json({
        token: token
    });
});

function userVerify(username, password, users){
    const user = users.find(
        (x)=>x.username === username && x.password === password
    );
    return user;

}



app.get('/api/teacher', ensureToken, (req,res)=>{
    jwt.verify(req.token, 'my_secret_key', (err, data)=>{
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                text : 'this is protected',
                data : data
            });
        }
    })
});

function ensureToken(req, res, next){
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403)
    }
}

app.listen(3000, ()=>{
    console.log(`app ini berjalan di 3000`)
})
