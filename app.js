const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const https = require("https");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); //this serve static files

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// failure post route
app.post("/failure", function (req, res) {
  res.redirect("/");
});

//post route to capture client input from the form
app.post("/", function (req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  console.log(firstName);

  //Mailchimp email api implementation
  var data = {
    members: [
      //how to create a list and add a member
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  var jsonData = JSON.stringify(data); //this convert to a string json object

  const url = "https://us14.api.mailchimp.com/3.0/lists/fcec82a20f"; //endpoint to add subsriber to our mailchip account
  const options = {
    method: "POST",
    auth: "scottdialo:b12515ae9b53ffd1daf955d962d38673-us14", //authentication, anyting as usrNmae and api key as pwrd
  };

  const requestData = https.request(url, options, function (response) {
    //checking to see if request was successful and display sucess msg
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    //getting data back and parsing into json object
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  requestData.write(jsonData);
  requestData.end();
});

//listening port route
//process.env.PORT is for heroku deployment and 3000 for local deployment
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000...");
});
