const Notification = ({ messege }) => {
  messege = messege;
  return <div className={messege.type}>{messege.content}</div>;
};

export default Notification;
