require("dotenv").config();
const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({ secret: process.env.SESSION_SECRET, resave:false, saveUninitialized:true }));

const db = new sqlite3.Database("database.db");
db.run(`CREATE TABLE IF NOT EXISTS urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE,
  original TEXT
)`);

app.post("/login", (req,res)=>{
  if(req.body.username===process.env.ADMIN_USER && req.body.password===process.env.ADMIN_PASS){
    req.session.admin=true;
    return res.redirect("/index.html");
  }
  res.send("Login gagal");
});

const auth=(req,res,next)=> req.session.admin?next():res.redirect("/login.html");

app.post("/api/shorten", auth, (req,res)=>{
  db.run("INSERT INTO urls(slug,original) VALUES(?,?)",
  [req.body.slug, req.body.original],
  err=> err?res.json({error:true}):res.json({success:true})
  );
});

app.get("/api/urls", auth, (req,res)=>{
  db.all("SELECT * FROM urls",[],(_,rows)=>res.json(rows));
});

app.get("/:slug",(req,res)=>{
  db.get("SELECT original FROM urls WHERE slug=?",[req.params.slug],
  (_,row)=> row?res.redirect(row.original):res.status(404).send("Not found"));
});

app.listen(3000);