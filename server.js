const express=require("express"); // importing express
const request1=require("request");
const app=express(); // initialzing app
const port=8080;
const {initializeApp,cert}=require('firebase-admin/app');
const {getFirestore}=require('firebase-admin/firestore');

var serviceAccount=require("./serviceAccountKey.json");
// const { request } = require("express");
app.use(express.static('public'));
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
initializeApp({
    credential: cert(serviceAccount)
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const db=getFirestore();
app.set('view engine','ejs');
app.get('/',(req,res)=>{
    res.render("web")
})
app.get("/register",(req,res)=>{
    res.render('register')
})
app.get("/signup",(req,res)=>{
    const name=req.query.name;
    const email=req.query.email;
    const password=req.query.pwd;

    db.collection('users').add({
        name:name,
        email:email,
        password:password,
    }).then(()=>{
        res.render("login")

    })

});
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/signin',(req,res)=>{
    const email=req.query.email;
    const password=req.query.pwd;

    db.collection('users')
    .where("email","==",email).where("password","==",password)
    .get()
    .then((docs)=>{
        if(docs.size>0){
            res.render('search')
        }
        else{
            res.render('loginfailed')
        }
    });
});
app.get('/About', (req, res)=>{
    res.render('About');
})
app.get('/search',(req,res)=>{
    res.render('search');
})

app.get('/getinfo',(req,res)=>{
    // const name=req.query.name;
    // var datainfo=[];
    // request1('https://api.nutritionix.com/v2_2/search/'+name+'?results=0:1&fields=*&appId=e8608263&appKey=0dbfc795425ebef10091408caf38b8a5',(error,response,body) => {
    // const data=JSON.parse(body)
    //    var a=data.hits[0].fields.nf_calories;
    //    var b=data.hits[0].fields.nf_sugars;
    //    var c=data.hits[0].fields.nf_total_carbohydrate;
    //    var d=data.hits[0].fields.nf_protein;
    //    datainfo.push(a)
    //    datainfo.push(b)
    //    datainfo.push(c)
    //    datainfo.push(d)
    //    res.render("datainfo",{user:datainfo})  
    const name = req.query.name;
const apiKey = 'tuiIxqHtXhifIOP4AlsEGA==7AwSCHscJJqfPA9v'; // Replace with your actual API key
const datainfo = [];

const apiUrl = 'https://api.calorieninjas.com/v1/nutrition?query=' + name;

request1.get({
  url: apiUrl,
  headers: {
    'X-Api-Key': apiKey
  },
}, function(error, response, body) {
  if (error) {
    return console.error('Request failed:', error);
  } else if (response.statusCode !== 200) {
    return console.error('Error:', response.statusCode, body.toString('utf8'));
  } else {
    const data = JSON.parse(body);

    // Assuming there might be multiple items in the response, we'll iterate over them
    data.items.forEach(item => {
      const { calories, sugar_g, fiber_g, protein_g } = item;

      datainfo.push({
        calories,
        sugar: sugar_g,
        totalfiber: fiber_g,
        protein: protein_g,
      });
    });

    res.render('datainfo', { user: datainfo });
  }
})
})

app.listen(port, ()=>{
    console.log('application is running on port 8080');
})


