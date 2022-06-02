const express = require("express");
const jwt = require('jsonwebtoken');
const app = express();

const {conn1,conn2} = require("./app/dbConfig.js");

app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application docker" });
});

app.get('/create-table-user', function (req, res) {
    conn1.connect(function(err) {
      if (err) throw err;
      const sql = `
      CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255),
        password VARCHAR(255),
        nama VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )  ENGINE=INNODB;
    `;
      conn1.query(sql, function (err, result) {
        if (err) throw err;
        res.send("user table created");
      });
    });
})

app.get('/create-table-mobil', function (req, res) {
    conn2.connect(function(err) {
      if (err) throw err;
      const sql = `
      CREATE TABLE IF NOT EXISTS buku (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(255),
        jenis VARCHAR(255),
        harga INT(11),
        tahun INT(11)
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )  ENGINE=INNODB;
    `;
      conn2.query(sql, function (err, result) {
        if (err) throw err;
        res.send("mobil table created");
      });
    });
})

app.post("/login",(req, res) => {
    let sql = `SELECT * FROM user WHERE email = '${req.body.email}' AND password = '${req.body.password}' `;
    conn1.query(sql,
    (error,result) => {
        if(result.length != 0) {
            const token = jwt.sign({
                id:result[0].id,
                email:result[0].email,
            },'the-super-strong-secrect');
            res.send({
                msg: 'Logged in!',
                token,
                user: result[0]
             });
        }else{
            res.status(300).json({message: 'user tidak ditemukan' });
        }
    })
})

app.post("/register",(req, res) => {
    let sql = `INSERT INTO user ( email, password, nama ) VALUES ('${req.body.email}','${req.body.password}','${req.body.nama}')`;
    conn1.query(sql,
    (error,result) => {
        res.send({
            msg: 'Registered in!',
        });
    })
})

app.get("/mobil",(req,res) => {
    //jwtCheck(req, res);
    conn2.query("SELECT * FROM mobil",(error,result) => {
        res.json({body: result });
    })
})

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
