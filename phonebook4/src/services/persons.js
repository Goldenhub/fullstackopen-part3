import axios from "axios";
const baseURL = "http://localhost:3001/phonebook";

const getPersons = () => {
    const request = axios.get(baseURL);
    return request.then(response => response.data);
}

const postPerson = (newPerson) => {
    const request = axios.post(baseURL, newPerson);
    return request.then(response => response.data);
}

const updateContact = (id, data) => {
    const request = axios.put(`${baseURL}/${id}`, data);
    return request.then(response => response.data)
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseURL}/${id}`);
    return request.then(response => response.data);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {getPersons, postPerson, deletePerson, updateContact};