import { useState, useEffect } from 'react';
// import Contacts from './components/Contacts';
import Button from './components/Button';
import Header from './components/Header';
import personService from './services/persons'
import axios from 'axios';

const Contacts = (props) => {
  return (
      props.persons.map((person, i) => {
        return (
          <div key={i}>
            <p key={person.id}>{person.name} {person.number}</p>
            <button key={i-1} onClick={()=>props.onClick(person)}>delete</button>
          </div>
      )})
  )
}

const Notification = (props) => {
  if (props.message === null) {
    return null
  }

  const notifStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={notifStyle}>
      {props.message}
    </div>
  )
}

const Error = (props) => {
  if (props.message === null) {
    return null
  }

  const notifStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderColor: 'red',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={notifStyle}>
      {props.message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');
  const [notification, setNotif] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        console.log(response.data)
        setPersons(response.data)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilterName(event.target.value);
  }

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(person.id)
        .then(deletedItem => {
          setPersons(persons.filter(person => person.id !== deletedItem.id));
          setNotif(`${deletedItem.name} has been removed from the phone book!`);
          setTimeout(() => {
            setNotif(null)
          }, 3000)
      })
  }
}

  const addContact = (event) => {
    event.preventDefault();
    const newPerson = {name: newName, number: newNumber};
    const check = checkName(newPerson);
    if (check[0]) {
      if (window.confirm(`${newPerson.name} is already added to the phonebook, replace the old number with a new one?`)) {
        personService
          .update(check[1], newPerson)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id !== updatedPerson.id ? person:updatedPerson));
            setNotif(`${newPerson.name}'s phone number has been updated to ${updatedPerson.number}`);
            setTimeout(() => {
              setNotif(null)
            }, 3000)
          })
          .catch(e => {
            console.log(e)
            setError(`${newPerson.name} was already removed from server!`)
            setTimeout(() => {
              setError(null)
            }, 3000)
            setPersons(persons.filter(person => person.id !== check[1]))
          })
      }
    } else {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNotif(`${newPerson.name} has been added to the phonebook!`);
          setTimeout(() => {
            setNotif(null)
          }, 3000)
        })
    }
    setNewName('');
    setNewNumber('');
  }

  const checkName = (toBeAdded) => {
    for (let person of persons) {
      if (JSON.stringify(person.name) === JSON.stringify(toBeAdded.name)) {
        return [true, person.id];
      }
    }
    return false;
  }

  const finalArray = filterName ? 
    persons.filter((person) => person.name.toLowerCase().includes(filterName.toLowerCase()))
    : persons

  return (
    <div>      
      <Header title="Phonebook"/>
      <Notification message={notification} />
      <Error message={error} />
      <div>
        filter shown with <input value={filterName} onChange={handleFilter}/>
      </div>
      <Header title="Add a new"/>
      <form onSubmit={addContact}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <Button />
      </form>
      <Header title="Numbers"/>
      <div>
        <Contacts persons={finalArray} onClick={handleDelete}/>
      </div>
    </div>
  )
}

export default App