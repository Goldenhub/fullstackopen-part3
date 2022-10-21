function Filter({handleFilter, filter}) {
  return (
    <>
      <h4>
        Filter shown with
        <input value={filter} onChange={handleFilter} />
      </h4>
    </>
  );
}

export default Filter;
