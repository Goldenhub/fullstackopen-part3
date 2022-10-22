const mongoose = require('mongoose');

if(process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);


const url = `mongodb+srv://fullstackopen:${password}@cluster0.yy4vaj2.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const PhoneBookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Phonebook = mongoose.model('phonebook', PhoneBookSchema);


mongoose.connect(url)
    .then(e => {
        console.log('connected')
        if (process.argv.length === 3) {
            return Phonebook.find({});
        }
        const entry = Phonebook({
            name: process.argv[3],
            number: process.argv[4]
        })
        return entry.save();
    })
    .then(result => {
        if (process.argv.length === 3 && result.length === 0) {
            console.log('Phonebook is empty');
            return mongoose.connection.close();
        }
        if (process.argv.length === 3) {
            console.log('phonebook:');
            result.forEach(entry => {
                console.log(`${entry.name} ${entry.number}`);
            })
        } else {
            console.log(`added ${result.name} number ${result.number} to phonebook`)
        }
        return mongoose.connection.close();
    })
    .catch(err => {
        console.log(err);
    })