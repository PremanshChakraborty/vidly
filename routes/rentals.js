const {Rental,validate} = require('../models/rentals');
const {Movie} = require('../models/movies');
const {Customer} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const { custom } = require('joi');
const router = express.Router();

router.get('/',async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
  });


  router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer');
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie');
    let rental = new Rental({
        customer: {
            _id: customer.id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    const db = await mongoose.createConnection('mongodb://localhost/vidly').asPromise();
    const session = await db.startSession();

    try {
        await session.withTransaction(async () => {
        rental.save();
        movie.numberInStock--;
        movie.save();
        res.send(rental);
        });
    }
    catch(ex){
        res.status(500).send('Something failed');
    }
     finally {
        await session.endSession();
        await db.close();
    }
  });

  router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
  
    if (!rental) return res.status(404).send('The Rental with the given ID was not found.');
  
    res.send(rental);
  });

module.exports = router;