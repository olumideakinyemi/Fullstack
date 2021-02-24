import React, { useState, useEffect } from 'react'
import personsService from './services/persons'
import Filter from './components/Filter'
import NewPerson from './components/NewPerson'
import PhoneBook from './components/PhoneBook'
import Notification from './components/Notification'

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter] = useState('')
  const [ notification, setNotification] = useState(null)
  const [ success, setSuccess] = useState(null)

  useEffect(() => {
    getPersons()
  }, [])


  const getPersons = () => {
    personsService
      .getAll()
      .then(response => {
        setPersons(response)
      })
      .catch(error => showMessage("Data search unsuccesful", false ))
  }



  const addEntry = (event) => {
    event.preventDefault()
    const entryObject = {
      name: newName,
      number: newNumber
    }

    if (persons.some(e => e.name === newName)) {

      let personId = persons.find(item => item.name === newName)
    
      let updatedEntry = Object.assign(personId, entryObject)

      if (window.confirm(`Do you want to update ${newName} with number ${newNumber}?`)) {
        personsService
        .update(personId.id, entryObject)
          .then( () => {
            setPersons(persons.map(item => (item.name === newName) ? updatedEntry : item))
            setNewName('')
            setNewNumber('')
            showMessage(`User ${newName} phone number has been updated`)
          })
          .catch(error => {
            showMessage(`Update unsuccesful. User ${newName} has already been removed from the phonebook.`, false)
            setPersons(persons.filter(n => n.name !== newName))
          })
           
      }
    }
    
    else {

      if (persons.some(e => e.number === newNumber)){
        showMessage(`Number ${newNumber} has already been added to the phonebook .`, false)
      }  
      else {

        if (newName === "" || newNumber === "") {
          showMessage(`Name and number cannot be empty`, false)
        }
        else {
          personsService
          .create(entryObject)
            .then(returnedPerson => {
              setPersons(persons.concat(returnedPerson))
              setNewName('')
              setNewNumber('')
              showMessage(`User ${newName} has already been added to the phonbook`)
          })
            .catch(error => {
              return showMessage(`Adding number unsuccesful. More info about error: ${error.response.data.error}`, false)}  )
            getPersons()
        }
      }
    }
     
  }

  const removeEntry = (person) => {
    if (window.confirm(`Remove ${person.name}?`)) { 
      personsService
      .remove(person.id)
        .then( () => {
          setPersons(persons.filter(item => item.id !== person.id ))
          showMessage(`User ${person.name} has already been deleted from the Phonebook`)
        })
      .catch(error => {
          showMessage(`Deleting unsuccesful. User ${person.name} has already been deleted from the Phonebook.`, false)
          console.log("id already removed (or other problem)")
          getPersons()
        })
    }
  }

  const handleNewName = (event) => {
    setNewName(event.target.value)  
  }

  const handleNewNumber= (event) => {
    setNewNumber(event.target.value)  
  }

  const filterNames = (event) => {
    setNewFilter(event.target.value)
  }

  const showMessage = (message, successNotification=true) => {
    setNotification(message)
    setSuccess(successNotification)
    
    setTimeout(() => {
      setNotification(null)
      setSuccess(null)
    }, 8000)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <div>{Notification(notification, success)}</div>
     {Filter(newFilter, filterNames)}
      <h2>Add a new</h2>
        {NewPerson(addEntry, newName, handleNewName, newNumber, handleNewNumber)}
      <h2>Numbers</h2>
        {PhoneBook(persons, newFilter, removeEntry)}
    </div>
  )

}

export default App