const express = require('express');
const router = new express.Router();
const createError = require('http-errors');
const { body, validationResult } = require('express-validator');

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
]

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('phoneList',{title :'Phones List',phones});
});
router.get('/new', (req, res, next) => {
  res.render('phoneForm', { title: 'New Contact' });
});

router.post(
  '/new',
  [
    body('lastName'),
    body('firstName'),
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
    res.redirect('/phones');
  }
});
module.exports = router;
