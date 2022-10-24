const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose.connect(url)
    .then(response => {
        console.log("connected to", url)
    })
    .catch(err => {
        console.log(err.message)
    })

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        required: true
    }
})

phonebookSchema.set('toJSON', {
    transform: (document, requestedObject) => {
        requestedObject.id = requestedObject._id
        delete requestedObject._id
        delete requestedObject.__v
    }
})

module.exports = mongoose.model('PhoneBook', phonebookSchema)