// Inports
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Vehicle = require('./app/models/vehicle');

// Configure app for bodyParser()
// lets us grab data from the body of the POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set up port for server to listen on
var port = process.env.PORT || 3000;

// Connect to DB
mongoose.connect('mongodb://localhost:27017/helloAPI');

// API Routes
var router = express.Router();

// Routes will be prefixed with /api
app.use('/api', router);

// Middleware
router.use(function(req, res, next) {
    console.log(' There is some serious processing going down in the background right now!!!');
    next();
})
// Test Route
router.get('/', function(req, res) {
    res.json({mesage: 'Welcome to our API!'});
});

router.route('/vehicles')

    .post(function(req, res) {
        var vehicle = new Vehicle();
        vehicle.make = req.body.make;
        vehicle.model = req.body.model;
        vehicle.color = req.body.color;

        vehicle.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Vehicle was successfully created...'});
        });
    })

    .get(function(req, res) {
        Vehicle.find(function(err, vehicles) {
            if (err) {
                res.send(err);
            }
            res.json(vehicles);
        });
    });


    router.route('/vehicle/:vehicle_id')
        .get(function(req, res) {
            Vehicle.findById(req.params.vehicle_id, function(err, vehicle) {
                if (err) {
                    res.send(err);
                }
                res.json(vehicle);
            });
        });

        router.route('/vehicle/make/:make')
        .get(function(req, res) {
            Vehicle.find({make:req.params.make}, function(err, vehicle) {
                if (err) {
                    res.send(err);
                }
                res.json(vehicle);
            });
        });

        router.route('/vehicle/color/:color')
        .get(function(req, res) {
            Vehicle.find({color:req.params.color}, function(err, vehicle) {
                if (err) {
                    res.send(err);
                }
                res.json(vehicle);
            });
        });

// Fire up our server
app.listen(port);
// Print message to console
console.log('Server is listening on port ' + port);