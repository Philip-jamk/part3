const Filter = ({ findContact, handleFindChange }) => {
  return (
    <div>
      filter shown with
      <input value={findContact} onChange={handleFindChange} />
    </div>
  );
};
export default Filter;
