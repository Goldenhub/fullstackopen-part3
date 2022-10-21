function PersonForm({ handleSubmit, handleChange, user }) {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={user.name} name="name" onChange={handleChange} />
      </div>
      <div>
        number:{" "}
        <input value={user.number} name="number" onChange={handleChange} />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
}

export default PersonForm;
