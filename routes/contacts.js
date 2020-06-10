const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route   GET api/contacts
// @desc    get all users contacts
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    // find all contacts where the user matches to the id of the user that is putting the request
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(`Server Error`);
  }
});

// @route   POST api/contacts
// @desc    add new contact
// @access  private
router.post(
  '/',
  [auth, [check('name', 'Name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // de-structure req.body
    const { name, email, phone, type } = req.body;

    // create new contact
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      // save contact to the database
      const contact = await newContact.save();

      // send contact info back
      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send(`Server Error`);
    }
  }
);

// @route   PUT api/contacts/:id
// @desc    update a contact
// @access  private
router.put('/:id', auth, async (req, res) => {
  // de-structure req.body
  const { name, email, phone, type } = req.body;

  // check if they're included and add them to the contact field
  const contactFields = {};

  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    // find the contact we want to update
    let contact = await Contact.findById(req.params.id);

    // check if contact exists
    if (!contact) {
      res.status(404).json({ msg: `Contact not found` });
    }

    // check that the user making the request is the owner of that contact istance
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: `Not authorized` });
    }

    // update
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`Server Error`);
  }
});

// @route   DELETE api/contacts/:id
// @desc    delete a contact
// @access  private
router.delete('/:id', auth, async (req, res) => {
  try {
    // find the contact by id
    let contact = await Contact.findById(req.params.id);

    // check if contact exists
    if (!contact) {
      res.status(404).json({ msg: `Contact not found` });
    }

    // check that the user making the request is the owner of that contact istance
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: `Not authorized` });
    }

    // delete
    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: `Contact removed` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`Server Error`);
  }
});

module.exports = router;
