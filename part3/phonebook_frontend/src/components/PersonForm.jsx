export const PersonForm = ({ newPerson, handleSubmit, handleInputChange }) => {
  return <>
    <form onSubmit={handleSubmit}>
      <div>
        name: <input name="name" value={newPerson.name} onChange={handleInputChange} />
      </div>
      <div>
        number: <input name="number" value={newPerson.number} onChange={handleInputChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </>;
};
