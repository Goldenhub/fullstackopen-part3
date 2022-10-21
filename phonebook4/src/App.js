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
        setPersons(phonebook);
      })
  }, [persons]);

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

    let stringedPersons = JSON.stringify(persons);
    let checkName = stringedPersons.includes(
      JSON.stringify(newUser.name.trim())
    );
    let checkNumber = stringedPersons.includes(
      JSON.stringify(newUser.number.trim())
    );
    if (!checkName && !checkNumber) {
      axiosServices
      .postPerson(newUser)
      .then((response) => {
        setPersons(persons.concat(response.data));
        setNewUser((prev) => ({
          ...prev,
          name: "",
          number: "",
        }));
        setSuccessMessage(`Added ${newUser.name}`);
        setTimeout(() => {
          setSuccessMessage('')
        }, 5000)
      });
      
    } else {
      if (checkName && checkNumber) {
        alert(`${newUser.name.trim()} details is already added to phonebook`);
      } else if (checkNumber) {
        alert(`${newUser.number.trim()} is already added to phonebook`);
      } else {
        if (window.confirm(`${newUser.name.trim()} is already added to phonebook, replace the Old number with a new one?`)){
          let requiredContact = persons.find(contact => contact.name === newUser.name.trim());
          let replacementContact = {...requiredContact, "number": newUser.number}
          axiosServices
            .updateContact(requiredContact.id, replacementContact)
            .then(response => {
              setSuccessMessage(`Updated ${newUser.name}`);
              setTimeout(() => {
                setSuccessMessage('')
              }, 5000)
            })
            .catch(e => {
              setErrorMessage(`Information of ${newUser.name} has already been removed from server`);
              setTimeout(() => {
                setErrorMessage('')
              }, 5000)
            })
        }
      }
    }
  };

  function handleChange({ target }) {
    const { name, value } = target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleDelete({target}) {
    if (window.confirm("Do you really want to delete this person")){
      axiosServices
        .deletePerson(target.id)
        .then(response => {
          setSuccessMessage(`Deleted successfully`)
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
      {errorMessage && <Notification message={errorMessage} type="success" />}
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
