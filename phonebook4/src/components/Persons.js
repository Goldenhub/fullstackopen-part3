
function Persons({filtered, handleDelete}) {
  
  return (
    <>
      {filtered.map(person => (
        <div key={person.name}>
          <p>
            {person.name}: {person.number}
            <button id={person.id} onClick={(event) => handleDelete(event)}>delete</button>
          </p>
        </div>
      ))}
    </>
  );
}

export default Persons;
