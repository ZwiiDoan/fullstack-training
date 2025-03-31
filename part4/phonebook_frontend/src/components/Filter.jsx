export const Filter = ({ filterValue, handleFilterChange }) => {
  return <div>
    filter shown with
    <input name="filterValue" value={filterValue} onChange={handleFilterChange} />
  </div>;
};
