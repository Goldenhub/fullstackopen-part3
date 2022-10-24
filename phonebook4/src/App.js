import "./App.css";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import Notification from "./components/Notification"
import axiosServices from "./services/persons"
import { useState, useEffect } from "react";

function App() {
  const [persons, setPersons] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    number: "",
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axiosServices.getPersons()
      .then(phonebook => {
        setPersons(phonebook.data);
      })
  }, []);

  const [filter, setFilter] = useState("");

  let filteredPersons = [];
  // console.log(persons)
  if(persons.length > 0) {
    filteredPersons = persons.filter((person) =>
      person?.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  function handleFilter(e) {
    setFilter(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    
    let name = newUser.name.trim()
    let number = newUser.number.trim()
    
    let duplicate = persons.find(e => {
      return e.name === name && e.number === number
    })
    let checkName = persons.find(e => {
      return e.name === name;
    })
    let checkNumber = persons.find(e => {
      return e.number === number
    })
    console.log(duplicate, checkName, checkNumber)

    if (duplicate) {
      setErrorMessage(`${name} details is already added to phonebook`)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    } else if(checkName) {
      if (window.confirm(`${name} is already added to phonebook, replace the Old number with a new one?`)) {
        let requiredContact = persons.find(contact => contact.name === name);
        let replacementContact = { ...requiredContact, "number": number }
        axiosServices
          .updateContact(requiredContact.id, replacementContact)
          .then(response => {
            setPersons(persons.map(person => person.id === response.data.id ? response.data : person));
            setNewUser((prev) => ({
              ...prev,
              name: "",
              number: "",
            }));
            setSuccessMessage(`Updated ${name}`);
            setTimeout(() => {
              setSuccessMessage('')
            }, 5000)
          })
          .catch(e => {
            setErrorMessage(`Information of ${name} has already been removed from server`);
            setTimeout(() => {
              setErrorMessage('')
            }, 5000)
          })
      }
    } else if (checkNumber) {
        setErrorMessage(`${number} is already added to phonebook`)
        setTimeout(() => {
          setErrorMessage('')
        }, 5000)
    }  else {
      axiosServices
      .postPerson(newUser)
        .then((response) => {
          setNewUser((prev) => ({
            ...prev,
            name: "",
            number: "",
          }));
          if (response.status === 200) {
            setPersons(persons.concat(response.data));
            setSuccessMessage(`Added ${newUser.name}`);
            setTimeout(() => {
              setSuccessMessage('')
            }, 5000)
          } else {
            setErrorMessage(response.error)
            setTimeout(() => {
              setErrorMessage('')
            }, 5000)
          }
      });
    }
    
  };

  function handleChange({ target }) {
    const { name, value } = target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleDelete({ target }) {
    if (window.confirm("Do you really want to delete this person")){
      axiosServices
        .deletePerson(target.id)
        .then(response => {
          setPersons(persons.filter(e => e.id !== target.id));
          setSuccessMessage('Record deleted successfully')
          setTimeout(() => {
              setSuccessMessage('')
          }, 5000)
        })
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      {successMessage && <Notification message={successMessage} type="success" />}
      {errorMessage && <Notification message={errorMessage} type="error" />}
      <Filter filter={filter} handleFilter={handleFilter} />

      <h2>Add New</h2>

      <PersonForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        user={newUser}
      />

      <h2>Numbers</h2>

      {persons.length > 0 ? <Persons handleDelete={handleDelete} filtered={filteredPersons} /> : <p>No Record</p>}
    </div>
  );
}

export default App;
