
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');



var handleCORS = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

// connection configurations
const mc = mysql.createConnection({
    host: 'mysql-instance1.cg9wk7dyi0wp.us-east-2.rds.amazonaws.com',
    user: 'sysadminoptout',
    password: 'secretpass123$',
    database: 'optout'
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
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'EndUsers list.' });
    });
});

// Search for todos with ‘bug’ in their name
app.get('/endusers/search/:keyword', function (req, res) {
    let keyword = req.params.keyword;
    mc.query("SELECT * FROM endusers WHERE `FirstName` LIKE ? OR `LastName` LIKE ? ", ['%' + keyword + '%','%' + keyword + '%']  , function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'EndUser search result.' });
    });
});

// Retrieve todo with id
app.get('/endusers/:id', function (req, res) {

    let EndUserID = req.params.id;

    mc.query('SELECT * FROM endusers where EndUserID=?', EndUserID, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'EndUser list.' });
    });

});

// Add a new todo
app.post('/endusers', function (req, res) {

    var enduser = req.body;

    mc.query("INSERT INTO `endusers` (`Title`, `FirstName`, `LastName`, `BuildingName`, `Street`, `City`, `Country`, `PostCode`, `ContactNumber`, `Email`) VALUES (?,?,?,?,?,?,?,?,?,?)", [enduser.Title, enduser.FirstName, enduser.LastName, enduser.BuildingName, enduser.Street, enduser.City, enduser.Country, enduser.PostCode, enduser.ContactNumber, enduser.Email] , function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New enduser has been created successfully.' });
    });
});

//  Update todo with id
app.put('/endusers', function (req, res) {

    let enduser = req.body;

    if (!enduser) {
        return res.status(400).send({ error: task, message: 'Please provide EndUser and EndUserID' });
    }

    mc.query("UPDATE `endusers` SET `Title`=?,`FirstName`=?,`LastName`=?,`BuildingName`=?,`Street`=?,`City`=?,`Country`=?,`PostCode`=?,`ContactNumber`=?,`Email`=? WHERE `EndUserID`=?", [enduser.Title, enduser.FirstName, enduser.LastName, enduser.BuildingName, enduser.Street, enduser.City, enduser.Country, enduser.PostCode, enduser.ContactNumber, enduser.Email, enduser.EndUserID], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'EndUser has been updated successfully.' });
    });
});

//  Delete todo
app.delete('/endusers/:EndUserID', function (req, res) {

    let EndUserID = req.params.EndUserID;

    mc.query('DELETE FROM `endusers` WHERE EndUserID = ?', [EndUserID], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Enduser has been deleted successfully.' });
    });
});

//*******************************************END USERS FINISH****************************************************



//*******************************************RESELLERS****************************************************
// Retrieve all todos
app.get('/resellers', function (req, res) {
    mc.query('SELECT * FROM `resellers`', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'resellers list.' });
    });
});

// Search for todos with ‘bug’ in their name
app.get('/resellers/search/:keyword', function (req, res) {
    let keyword = req.params.keyword;
    mc.query("SELECT * FROM resellers WHERE `ResellerName` LIKE ?",['%' + keyword + '%']  , function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'reseller search result.' });
    });
});

// Retrieve todo with id
app.get('/resellers/:id', function (req, res) {

    let resellerID = req.params.id;

    mc.query('SELECT * FROM resellers where ResellerID=?', resellerID, function (error, results, fields) {
        if (error) throw error;
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
        if (error) throw error;
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
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'reseller has been updated successfully.' });
    });
});

//  Delete todo
app.delete('/resellers/:id', function (req, res) {

    let resellerID = req.params.id;

    mc.query('DELETE FROM `resellers` WHERE resellerID = ?', [resellerID], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'reseller has been deleted successfully.' });
    });
});
//*******************************************RESELLERS FINISH****************************************************




//*******************************************MARKETERS****************************************************
app.get('/marketers', function (req, res) {
    mc.query('SELECT * FROM `marketers`', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'marketers list.' });
    });
});

// Search for todos with ‘bug’ in their name
app.get('/marketers/search/:keyword', function (req, res) {
    let keyword = req.params.keyword;
    mc.query("SELECT * FROM marketers WHERE `FirstName` LIKE ? OR `LastName` LIKE ? ",['%' + keyword + '%','%' + keyword + '%']  , function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'marketer search result.' });
    });
});

// Retrieve todo with id
app.get('/marketers/:id', function (req, res) {

    let MarketersID = req.params.id;

    mc.query('SELECT * FROM `marketers` where `MarketersID`=?', MarketersID, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'marketer list.' });
    });

});

// Add a new todo
app.post('/marketers', function (req, res) {

    let marketer = req.body;

    if (!marketer) {
        return res.status(400).send({ error:true, message: 'Please provide marketer' });
    }

    mc.query("INSERT INTO `marketers`(`Title`, `FirstName`, `SurName`, `CompanyPosition`, `BusinessName`, `BusinessCategory`, `BuildingName`, `Street`, `City`, `Country`, `Postcode`, `ContactNumber`, `Email`, `ContactFax`, `ContactMobile`, `Password`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [marketer.Title, marketer.FirstName, marketer.SurName, marketer.CompanyPosition, marketer.BusinessName, marketer.BusinessCategory, marketer.BuildingName, marketer.Street, marketer.City, marketer.Title, marketer.Country, marketer.Postcode, marketer.ContactNumber, marketer.Email, marketer.ContactFax, marketer.ContactMobile, marketer.Password], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New marketer has been created successfully.' });
    });
});

//  Update todo with id
app.put('/marketers', function (req, res) {

    let marketer = req.body;

    if (!marketer) {
        return res.status(400).send({ error: task, message: 'Please provide marketer and marketerID' });
    }





    mc.query("UPDATE `marketers` SET `Title`=?,`FirstName`=?,`SurName`=?,`CompanyPosition`=?,`BusinessName`=?,`BusinessCategory`=?,`BuildingName`=?,`Street`=?,`City`=?,`Country`=?,`Postcode`=?,`ContactNumber`=?,`Email`=?,`ContactFax`=?,`ContactMobile`=?,`Password`=? WHERE `MarketersID`=?", [marketer.Title, marketer.FirstName, marketer.SurName, marketer.CompanyPosition, marketer.BusinessName, marketer.BusinessCategory, marketer.BuildingName, marketer.Street, marketer.City, marketer.Country, marketer.Postcode, marketer.ContactNumber, marketer.Email, marketer.ContactFax, marketer.ContactMobile, marketer.Password, marketer.MarketersID], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'marketer has been updated successfully.' });
    });
});

//  Delete todo
app.delete('/marketers/:id', function (req, res) {

    let marketerID = req.params.id;

    mc.query('DELETE FROM `marketers` WHERE MarketersID = ?', [marketerID], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'marketer has been deleted successfully.' });
    });
});
//*******************************************MARKETERS FINISH****************************************************

app.post('/login', function (req, res) {

    let User = req.body;
    if (!User) {
        return res.status(400).send({ error:true, message: 'Please provide User' });
    }

    mc.query("SELECT * FROM `Users` WHERE `Username`=? AND `Password`=? AND `isEnabled`=1", [User.Username, User.Password], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User Details' });
    });
});


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

// allows "grunt dev" to create a development server with livereload
//module.exports = app;
