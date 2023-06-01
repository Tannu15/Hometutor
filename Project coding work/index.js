const express = require("express");
const mysql = require("mysql");
const app = express();
const PORT = 5000;
const DB_URI = 'mongodb+srv://tanusain1508:manish123@cluster0.t1ucqii.mongodb.net/?retryWrites=true&w=majority'
const mongoose = require("mongoose");

app.use(express.json());
app.use(express.static('public'));

// const connection = mysql.createConnection({
//     host : 'localhost',
//     user : 'root',
//     password : '',
//     database : "hometutor"
// });

// connection.connect((err)=>{
//     if (err) {
//         console.log('database is not connected' + err);
//         return;
//     }

//     console.log('Connected to the database !!');
//     // connection.end();
// })


mongoose.set("strictQuery", false);
mongoose
    .connect(DB_URI)
    .then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
        console.log(err);
    });




app.get('/', (req, res) => {
    res.sendFile(__dirname + './home.html');
})

app.post('/register', (req, res) => {
    const email = req.body.email;

    let user = await User.findOne({ email });
    if (user) return next(new ErrorHandler("User Already Exit", 401));
    user = await User.create(req.body);
  
    sendToken(res, user, "User Registered SuccessFully", 201);

  
})

app.post('/teacher', (req, res) => {
    const { name, phone, email, course, subject } = req.body;
    console.log(name);

    const query = 'INSERT INTO teacher (name,phone,email,course,subject) VALUES (?,?,?,?,?)';
    const values = [name, phone, email, course, subject];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.log("Not register some error occured ", err);
            res.status(500).json({ message: 'Error inserting data' });
            return;
        }
        console.log('Data Inserted Successfully');
        res.status(200).json({ message: 'Data inserted successfully' });
    });
})

app.get('/register', (req, res) => {
    connection.query('SELECT * FROM register', (error, results) => {
        if (error) {
            console.error('Error executing  query:', error);
            res.status(500).json({ message: 'Error retrieving' });
            return;
        }

        res.status(200).json(results);
    })
})

app.get('/teacher', (req, res) => {
    connection.query('SELECT * FROM teacher', (error, results) => {
        if (error) {
            console.error('Error executing  query:', error);
            res.status(500).json({ message: 'Error retrieving' });
            return;
        }

        res.status(200).json(results);
    })
})


app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
})