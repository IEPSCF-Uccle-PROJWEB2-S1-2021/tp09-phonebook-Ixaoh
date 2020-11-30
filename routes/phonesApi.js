const express = require('express');
const { body, validationResult } = require('express-validator');
const createError = require('http-errors');

class Phone {
  constructor(lastName, firstName, birthDate,phoneNumber,emailAddress) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.birthDate = birthDate;
    this.phoneNumber = phoneNumber;
    this.emailAddress = emailAddress;
  }
}

const phones = [
  new Phone ('Dupont','Jean','1997-01-01','+3248875178','jeandupont@gmail.com'),
  new Phone ('Flower','Martin','1997-05-12','+324945408','martinflower@gmail.com'),
  new Phone ('Neymar','Jean','1997-05-12','+3266798540','jeanneymar@gmail.com'),
  new Phone ('angroma','Roger','1997-05-12','+324945408','rogerangroma@gmail.com'),
];

const router = new express.Router();

function requireAcceptsJson(req, res, next) {
  if (req.accepts('json')) {
    next();
  } else {
    next(createError(406));
  }
}

// Only responds to client accepting JSON
router.all('*', requireAcceptsJson);

router.get('/', (req, res, next) => {
  res. json({ phones });
});

router.post(
  '/',
  [
    body('lastName').escape(),
    body('firstName').escape(),
    body('birthDate'),
    body('phoneNumber'),
    body('emailAddress')
],
(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(createError(400));
  } else {
    const phone = new Phone(req.body.lastName,req.body.firstName, req.body.birthDate, req.body.phoneNumber,req.body.emailAddress);
    phones.push(phone);
    res.status(201);
    res.send('Created');
  }
});
module.exports = router;
