var express = require("express")
var mysql = require('mysql')
var existUser,existFlight
var age,Source
var gender,Destination
var userid,flightid,tcost
var mobnum,date1,time,fare
var bodyParser = require("body-parser")
methodOverride = require("method-override")
app = express()


app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(methodOverride("_method"))

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'airline2'
})
connection.connect(function (error) {
    if (!error) {
        console.log("Connection successful")
    }
})

app.get("/",function(req,res){
    res.render("home",{currentUser: existUser})
})

app.get("/hist",function(req,res){
    var sql = "SELECT * FROM user,flight,booking WHERE user.User_Id = booking.User_id and flight.Flight_id = booking.Flight_id and user.Name='"+existUser+"'";
    connection.query(sql, function (err, result) {
        if (err) {console.log("No bookings have been made yet ")
    };
        console.log(result)
        res.render("history", { currentUser: existUser,result:result,age:age,gender:gender,mobnum:mobnum,Source:Source })
    });
})

app.get("/book",function(req,res){
    res.render("booked",{currentUser:existUser})
})

app.get("/logout",function(req,res){
    existUser = undefined
    res.render("loggedout",{currentUser:undefined})
})

app.get("/signup", function (req, res) {
    res.render("register", {
        currentUser: existUser
    })
})

app.get("/signin",function(req,res){
    res.render("login", {
        currentUser: existUser
    })
})
app.post("/", function (req, res) {
        if(req.body.age)
        {var sql = "INSERT INTO user (Name, Password, Age, Gender, Mob_num) VALUES ('" + req.body.uname + "','" + req.body.passwrd + "','" + req.body.age + "','" + req.body.gender + "','" + req.body.phnumber+"')";
        connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
            existUser = req.body.uname
            age = req.body.age
            gender = req.body.gender
            mobnum = req.body.phnumber
            res.render("home" ,{
                currentUser: req.body.uname
            })
        });}
        else{
            var sql = "SELECT * FROM user WHERE NAME ='"+req.body.uname+"'";
            connection.query(sql, function (err, result) {
                if (err) throw err;
                //console.log(result[0].Name);
                userid = result[0].User_Id
                existUser = result[0].Name
                age = result[0].Age
                gender = result[0].Gender
                mobnum = result[0].Mob_num
                res.render("home" ,{currentUser: result[0].Name })
            });
           
        }


})

app.get("/new1",function(req,res){
    if(!existUser){
        res.redirect('/signin')
    }
    else{
    res.render("new", {
        currentUser: existUser
    })
    }
})

app.get("/list",function(req,res){
    res.render("show", {
        currentUser: existUser
    })
})

app.post("/list", function (req, res) {
    var sql = "SELECT * FROM flight WHERE date ='"+req.body.year+"-"+req.body.month+"-"+req.body.day+"' and source = '"+req.body.source+"' and destination = '"+req.body.dest+"'";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        
        flightid = result[0].Flight_id
        Source = result[0].Source
        Destination = result[0].Destination
        date1 = result[0].Date
        time = result[0].Time
        fare = result[0].Fare
        /*console.log(flightid)
        console.log(Source)
        console.log(Destination)
        console.log(date1)
        console.log(time)
        console.log(fare)*/
        res.render("show", { result: result,currentUser:existUser })
    });
})

app.post("/book",function(req,res){
    var sql = "INSERT INTO Booking (User_id, Flight_id, SeatsNo, TotalCost) VALUES ('" + userid + "','" + flightid + "','" + req.body.seats + "','" + fare*(req.body.seats) + "')";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.render("booked", {
            age:age,
            Source:Source,
            Destination:Destination,
            mobnum:mobnum,
            date1:date1,
            time:time,
            userid:userid,
            flightid:flightid,
            gender:gender,
            fare:fare,
            currentUser: existUser,
            seats:req.body.seats
        })
    });
})


app.listen(3000, function () {
    console.log("Server is Running")
})



