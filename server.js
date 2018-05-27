
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");
const fs = require('fs');
const nodemailer = require('nodemailer');


var handleCORS = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

// connection configurations
const mc = mysql.createConnection({
    host: 'wrollit.com',
    user: 'OptOutUser',
    password: 'etTmz,0zxOX(',
    database: 'Wrollit_Optout',
    typeCast: function castField( field, useDefaultTypeCasting ) {

        // We only want to cast bit fields that have a single-bit in them. If the field
        // has more than one bit, then we cannot assume it is supposed to be a Boolean.
        if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {

            var bytes = field.buffer();

            // A Buffer in Node represents a collection of 8-bit unsigned integers.
            // Therefore, our single "bit field" comes back as the bits '0000 0001',
            // which is equivalent to the number 1.
            return( bytes[ 0 ] === 1 );

        }

        return( useDefaultTypeCasting() );

    }
});

// connect to database
mc.connect();

app.use(cors());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));


// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});


//*******************************************END USERS****************************************************
// Retrieve all todos
app.get('/endusers', function (req, res) {
    mc.query('SELECT * FROM `endusers`', function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'EndUsers list.' });
    });
});

// Search for todos with ‘bug’ in their name
app.get('/endusers/search/:keyword', function (req, res) {
    let keyword = req.params.keyword;
    mc.query("SELECT * FROM endusers WHERE `FirstName` LIKE ? OR `LastName` LIKE ? ", ['%' + keyword + '%','%' + keyword + '%']  , function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'EndUser search result.' });
    });
});

// Retrieve todo with id
app.get('/endusers/:id', function (req, res) {

    let EndUserID = req.params.id;

    mc.query('SELECT * FROM endusers where EndUserID=?', EndUserID, function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results[0], message: 'EndUser list.' });
    });

});

// Retrieve todo with id
app.get('/enduserswr/:id', function (req, res) {
    let ResellerID = req.params.id;
    mc.query('SELECT * FROM endusers where ResellerID=?', ResellerID, function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'EndUser list.' });
    });
});

// Add a new todo
app.post('/endusers', function (req, res) {
    processSuppressions();
    var enduser = req.body;

    mc.query("INSERT INTO `endusers` (`Title`, `FirstName`, `LastName`, `BuildingName`, `Street`, `City`, `Country`, `PostCode`, `ContactNumber`, `Mobile`, `Fax`, `Email`, `StopCalls`, `StopFax`, `StopText`, `StopMail`, `StopEmail`, `StopAll`, `DateAdded`, `ResellerID`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),?)", [enduser.Title, enduser.FirstName, enduser.LastName, enduser.BuildingName, enduser.Street, enduser.City, enduser.Country, enduser.PostCode, enduser.ContactNumber, enduser.Mobile, enduser.Fax, enduser.Email, enduser.StopCalls, enduser.StopFax, enduser.StopText, enduser.StopMail, enduser.StopEmail, enduser.StopAll, enduser.ResellerID] , function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'New enduser has been created successfully.' });
    });
});

//  Update todo with id
app.put('/endusers', function (req, res) {

    let enduser = req.body;

    if (!enduser) {
        return res.status(400).send({ error: task, message: 'Please provide EndUser and EndUserID' });
    }

    mc.query("UPDATE `endusers` SET `Title`=?,`FirstName`=?,`LastName`=?,`BuildingName`=?,`Street`=?,`City`=?,`Country`=?,`PostCode`=?,`ContactNumber`=?, `Mobile`=?, `Fax`=?, `Email`=?, `StopCalls`=?,`StopFax`=?,`StopText`=?,`StopMail`=?,`StopEmail`=?,`StopAll`=?,`ResellerID`=? WHERE `EndUserID`=?", [enduser.Title, enduser.FirstName, enduser.LastName, enduser.BuildingName, enduser.Street, enduser.City, enduser.Country, enduser.PostCode, enduser.ContactNumber, enduser.Mobile, enduser.Fax, enduser.Email,  enduser.StopCalls, enduser.StopFax, enduser.StopText, enduser.StopMail, enduser.StopEmail, enduser.StopAll, enduser.ResellerID, enduser.EndUserID], function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'EndUser has been updated successfully.' });
    });
});

//  Delete todo
app.delete('/endusers/:EndUserID', function (req, res) {

    let EndUserID = req.params.EndUserID;

    mc.query('DELETE FROM `endusers` WHERE EndUserID = ?', [EndUserID], function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'Enduser has been deleted successfully.' });
    });
});

//*******************************************END USERS FINISH****************************************************



//*******************************************RESELLERS****************************************************
// Retrieve all todos
app.get('/resellers', function (req, res) {
    mc.query('SELECT * FROM `resellers`', function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'resellers list.' });
    });
});

// Search for todos with ‘bug’ in their name
app.get('/resellers/search/:keyword', function (req, res) {
    let keyword = req.params.keyword;
    mc.query("SELECT * FROM resellers WHERE `ResellerName` LIKE ?",['%' + keyword + '%']  , function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'reseller search result.' });
    });
});

// Retrieve todo with id
app.get('/resellers/:id', function (req, res) {

    let resellerID = req.params.id;

    mc.query('SELECT * FROM resellers where ResellerID=?', resellerID, function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results[0], message: 'reseller list.' });
    });

});

// Add a new todo
app.post('/resellers', function (req, res) {

    let reseller = req.body;


    if (!reseller) {
        return res.status(400).send({ error:true, message: 'Please provide reseller' });
    }

    mc.query("INSERT INTO `resellers` (`ResellerName`, `Address`, `ContactNumber`, `Email`, `Username`, `Password`) VALUES (?,?,?,?,?,?)", [reseller.ResellerName, reseller.Address, reseller.ContactNumber, reseller.Email, reseller.Username, reseller.Password], function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'New reseller has been created successfully.' });
    });
});

//  Update todo with id
app.put('/resellers', function (req, res) {

    let reseller = req.body;

    if (!reseller) {
        return res.status(400).send({ error: task, message: 'Please provide reseller and resellerID' });
    }

    mc.query("UPDATE `resellers` SET `ResellerName`=?,`Address`=?,`ContactNumber`=?,`Email`=?,`Username`=?,`Password`=? WHERE `ResellerID`=?", [reseller.ResellerName, reseller.Address, reseller.ContactNumber, reseller.Email, reseller.Username, reseller.Password, reseller.ResellerID], function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'reseller has been updated successfully.' });
    });
});

//  Delete todo
app.delete('/resellers/:id', function (req, res) {

    let resellerID = req.params.id;

    mc.query('DELETE FROM `resellers` WHERE resellerID = ?', [resellerID], function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'reseller has been deleted successfully.' });
    });
});
//*******************************************RESELLERS FINISH****************************************************




//*******************************************MARKETERS****************************************************
app.get('/marketers', function (req, res) {
    mc.query('SELECT * FROM `marketers`', function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'marketers list.' });
    });
});

// Search for todos with ‘bug’ in their name
app.get('/marketers/search/:keyword', function (req, res) {
    let keyword = req.params.keyword;
    mc.query("SELECT * FROM marketers WHERE `FirstName` LIKE ? OR `LastName` LIKE ? ",['%' + keyword + '%','%' + keyword + '%']  , function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'marketer search result.' });
    });
});

// Retrieve todo with id
app.get('/marketers/:id', function (req, res) {

    let MarketersID = req.params.id;

    mc.query('SELECT * FROM `marketers` where `MarketersID`=?', MarketersID, function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results[0], message: 'marketer list.' });
    });

});

// Add a new todo
app.post('/marketers', function (req, res) {

    processSuppressions();
    let marketer = req.body;

    if (!marketer) {
        return res.status(400).send({ error:true, message: 'Please provide marketer' });
    }

    mc.query("INSERT INTO `marketers`(`Title`, `FirstName`, `SurName`, `CompanyPosition`, `BusinessName`, `BusinessCategory`, `BuildingName`, `Street`, `City`, `Country`, `Postcode`, `ContactNumber`, `Email`, `ContactFax`, `ContactMobile`, `Password`, `ConsumerTelephone`, `ConsumerFax`, `ConsumerMobile`, `ConsumerAddress`, `ConsumerEmail`, `BusinessTelephone`, `BusinessFax`, `BusinessMobile`, `BusinessAddress`, `BusinessEmail`, `mcTelephone`, `mcFax`, `mcMobile`, `mcAddress`, `mcEmail`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [marketer.Title, marketer.FirstName, marketer.SurName, marketer.CompanyPosition, marketer.BusinessName, marketer.BusinessCategory, marketer.BuildingName, marketer.Street, marketer.City, marketer.Title, marketer.Country, marketer.Postcode, marketer.ContactNumber, marketer.Email, marketer.ContactFax, marketer.ContactMobile, marketer.Password, marketer.ConsumerTelephone, marketer.ConsumerFax, marketer.ConsumerMobile, marketer.ConsumerAddress, marketer.ConsumerEmail, marketer.BusinessTelephone, marketer.BusinessFax, marketer.BusinessMobile, marketer.BusinessAddress, marketer.BusinessEmail, marketer.mcTelephone, marketer.mcFax, marketer.mcMobile, marketer.mcAddress, marketer.mcEmail], function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'New marketer has been created successfully.' });
    });
});

//  Update todo with id
app.put('/marketers', function (req, res) {


    let marketer = req.body;

    if (!marketer) {
        return res.status(400).send({ error: task, message: 'Please provide marketer and marketerID' });
    }

    mc.query("UPDATE `marketers` SET `Title`=?,`FirstName`=?,`SurName`=?,`CompanyPosition`=?,`BusinessName`=?,`BusinessCategory`=?,`BuildingName`=?,`Street`=?,`City`=?,`Country`=?,`Postcode`=?,`ContactNumber`=?,`Email`=?,`ContactFax`=?,`ContactMobile`=?,`Password`=?, `ConsumerTelephone`=?,`ConsumerFax`=?,`ConsumerMobile`=?,`ConsumerAddress`=?,`ConsumerEmail`=?,`BusinessTelephone`=?,`BusinessFax`=?,`BusinessMobile`=?,`BusinessAddress`=?,`BusinessEmail`=?, ,`mcTelephone`=?,`mcFax`=?,`mcMobile`=?,`mcAddress`=?,`mcEmail`=? WHERE `MarketersID`=?", [marketer.Title, marketer.FirstName, marketer.SurName, marketer.CompanyPosition, marketer.BusinessName, marketer.BusinessCategory, marketer.BuildingName, marketer.Street, marketer.City, marketer.Country, marketer.Postcode, marketer.ContactNumber, marketer.Email, marketer.ContactFax, marketer.ContactMobile, marketer.Password, marketer.ConsumerTelephone, marketer.ConsumerFax, marketer.ConsumerMobile, marketer.ConsumerAddress, marketer.ConsumerEmail, marketer.BusinessTelephone, marketer.BusinessFax, marketer.BusinessMobile, marketer.BusinessAddress, marketer.BusinessEmail, marketer.mcTelephone, marketer.mcFax, marketer.mcMobile, marketer.mcAddress, marketer.mcEmail, marketer.MarketersID], function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'marketer has been updated successfully.' });
    });
});

//  Delete todo
app.delete('/marketers/:id', function (req, res) {

    let marketerID = req.params.id;

    mc.query('DELETE FROM `marketers` WHERE MarketersID = ?', [marketerID], function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'marketer has been deleted successfully.' });
    });
});
//*******************************************MARKETERS FINISH****************************************************

app.post('/login', function (req, res) {

    let User = req.body;
    if (!User) {
        return res.status(400).send({ error:true, message: 'Please provide User' });
    }

    mc.query("SELECT * FROM `users` WHERE `Username`=? AND `Password`=? AND `isEnabled`=1", [User.Username, User.Password], function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'User Details' });
    });
});


app.post('/resellerlogin', function (req, res) {

    let User = req.body;
    if (!User) {
        return res.status(400).send({ error:true, message: 'Please provide User' });
    }

    mc.query("SELECT * FROM `resellers` WHERE `Username`=? AND `Password`=?", [User.Username, User.Password], function (error, results, fields) {
        if (error)  return res.json({error_code:1,err_desc:error, data: null});
        return res.send({ error: false, data: results, message: 'User Details' });
    });
});


//************************************************UPLOAD FILE **************************************************

var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });
var upload = multer({ //multer settings
                storage: storage,
                fileFilter : function(req, file, callback) { //file filter
                    if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                        return callback(new Error('Wrong extension type'));
                    }
                    callback(null, true);
                }
            }).single('file');
/** API path that will upload the files */
app.post('/upload', function(req, res) {
    var exceltojson;
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        /** Multer gives us file info in req.file object */
        if(!req.file){
            res.json({error_code:1,err_desc:"No file passed"});
            return;
        }
        /** Check the extension of the incoming file and
         *  use the appropriate module
         */
        if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders:true
            }, function(err,result){
                if(err) {
                    return res.json({error_code:1,err_desc:err, data: null});
                }
                res.json({error_code:0,err_desc:null, data: result});
            });
        } catch (e){
            res.json({error_code:1,err_desc:"Corrupted excel file"});
        }
    })
});



var processSuppressions = function()
{
  var CSVData = "";
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
          user: 'datasafe11234@gmail.com',
          pass: 'test123$'
      }
  });
  mc.query("SELECT * FROM `marketers` WHERE ?", [1], function (error, results, fields) {
      results.forEach(function(marketer){
        var MarketerID = marketer.MarketersID;
        var EndUserData = "";
        var fileReference = guid();
        var stream = fs.createWriteStream("suppressions/"+fileReference+".csv");
        EndUserData = "ReferenceNo,Title,FirstName,LastName";
        if (marketer.mcTelephone) EndUserData+=",Telephone";
        if (marketer.mcFax) EndUserData+=",Fax";
        if (marketer.mcMobile) EndUserData+=",Mobile";
        if (marketer.mcAddress) EndUserData+=",Address";
        if (marketer.mcEmail) EndUserData+=",Email";
        EndUserData+="\n";
        stream.once('open', function(fd) {
          stream.write(EndUserData);
          stream.end();
        });
        EndUserData="";
        mc.query("SELECT * FROM `endusers` WHERE `EndUserID` NOT IN (SELECT `EndUserID` FROM `suppressions` WHERE MarketerID=?)", [MarketerID], function (err, res, fields) {
            res.forEach(function(enduser){

              var ReferenceNo = guid();
              var EndUserID = enduser.EndUserID;

              var Title = enduser.Title;
              var FirstName = enduser.FirstName;
              var LastName = enduser.LastName;

              EndUserData = ReferenceNo + "," + Title + "," + FirstName + "," + LastName;

              if (enduser.StopCalls && marketer.mcTelephone)
              {
                if (marketer.ConsumerTelephone)
                {
                  EndUserData += "," + enduser.ContactNumber;
                }
              }

              if (enduser.StopFax && marketer.mcFax)
              {
                if (marketer.ConsumerFax)
                {
                  EndUserData += "," + enduser.Fax;
                }
              }

              if (enduser.StopText && marketer.mcMobile)
              {
                if (marketer.ConsumerMobile)
                {
                  EndUserData += "," + enduser.Mobile;
                }
              }

              if (enduser.StopMail && marketer.mcAddress)
              {
                if (marketer.ConsumerAddress)
                {
                  EndUserData += "," + "\""+ enduser.BuildingName + ", " + enduser.Street + "," + enduser.City + "," + enduser.Country + "," + enduser.PostCode +"\"";
                }
              }

              if (enduser.StopEmail && marketer.mcEmail)
              {
                if (marketer.ConsumerEmail)
                {
                  EndUserData += "," + enduser.Email;
                }
              }

              EndUserData += "\n";

              stream.once('open', function(fd) {
                stream.write(EndUserData);
                stream.end();
              });
            });
        });

        let mailOptions = {
            from: '"DataSafe Mail" <datasafe11234@gmail.com>', // sender address
            to: marketer.Email, // list of receivers
            subject: 'Suppressions - '+fileReference, // Subject line
            html: '<b>Please find attached!</b>',
            attachments: [{
                path: "suppressions/"+fileReference+".csv"
            }]
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });


      });

  });


}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4();
}

// allows "grunt dev" to create a development server with livereload
//module.exports = app;


// all other requests redirect to 404
app.all("*", function (req, res) {
    return res.status(404).send('page not found')
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});


// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});
