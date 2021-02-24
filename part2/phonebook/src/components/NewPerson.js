import React from 'react'

const NewPerson = (addEntry, newName, handleNewName, newNumber, handleNewNumber) => {
      
      return  <>
        <form onSubmit={addEntry}>
        <div>name: <input value={newName}
        onChange={handleNewName} />
        </div>
        <div>number: <input value={newNumber}
        onChange={handleNewNumber} />
        </div>
        <div><button type="submit">Add</button></div>
        </form>
      </>
  }

  export default NewPerson