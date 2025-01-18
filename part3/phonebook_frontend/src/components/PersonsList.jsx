const Person = ({ person, handleClick }) => {
  return <div>{person.name} {person.number} <button onClick={handleClick}>delete</button></div>
}

export const PersonsList = ({ persons, handleDeletion }) => {
  return <>
    {persons.map(person => <Person key={person.id} person={person} handleClick={() => handleDeletion(person)}/>)}
  </>;
};
