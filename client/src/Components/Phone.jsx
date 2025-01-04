const Phone = ({ contactToShow, deletephone }) => {
  contactToShow = contactToShow;
  deletephone = deletephone;
  return (
    <div>
      {contactToShow.map((phonecontact) => (
        <div key={phonecontact.id}>
          <span>
            {phonecontact.name} {phonecontact.number} &nbsp;
          </span>
          <button onClick={() => deletephone(phonecontact.id)}> Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Phone;
