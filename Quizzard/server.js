/*
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: '10.115.2.38',
  user: 'root',
  password: '12345678',
  database: 'Quizzard'
});

connection.connect();

app.get('/', (req, res) => {
  connection.query('SELECT * FROM your_table', (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
});

require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.post("/login", (req, res) => {
  const USERNAME = "uma victor";
  const PASSWORD = "8888";

  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    const user = {
      id: 1,
      name: "uma victor",
      username: "uma victor",
    };
    const token = jwt.sign(user, process.env.JWT_KEY);
    res.json({
      token,
      user,
    });
  } else {
    res.status(403);
    res.json({
      message: "wrong login information",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
*/

//require("dotenv").config();
import express from "express";
import cors from "cors";
import mysql from "mysql2";
import jwt from "jsonwebtoken";
//const express = require("express");
//const cors = require("cors");
//const mysql = require("mysql2");
//const jwt = require("jsonwebtoken");

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "10.115.2.38",
  user: "root",
  password: "12345678",
  database: "Quizzard",
});

connection.connect();

app.get("/", (req, res) => {
  console.log("hog")
  connection.query("SELECT * FROM your_table", (error, results, fields) => {
    if (error) throw error;
    res.json(results);
  });
  const user = { id: 1, name: "uma victor", username: "uma victor" };
  const token = jwt.sign(user, process.env.JWT_KEY);
  res.json({ token, user });
});
console.log("gus")

app.post("/login", (req, res) => {
  const USERNAME = "uma victor";
  const PASSWORD = "8888";
  console.log("sus");
const { username, password } = req.body;
console.log(req.body);

  if (username === USERNAME && password === PASSWORD) {
    const user = {
      id: 1,
      name: "uma victor",
      username: "uma victor",
    };
    const token = jwt.sign(user, process.env.JWT_KEY);
    res.json({
      token,
      user,
    });
  } else {
    res.status(403);
    res.json({
      message: "wrong login information",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});