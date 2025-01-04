import { useState, useEffect } from "react";
import Phone from "./Components/Phone";
import PersonForm from "./Components/PersonForm";
import Filter from "./Components/Filter";
import PhoneService from "./services/phone";
import Notification from "./Components/messeges";

const App = () => {
  const [persons, setPerson] = useState([]);
  const [newName, setNewNames] = useState();
  const [newPhone, setNewPhones] = useState();
  const [findContact, setFindContact] = useState();
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState({
    content: "",
    type: "normal",
  });

  /*const [persons, setPerson] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);*/
  /*const hook = () => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPerson(response.data);
    });
  };
  useEffect(hook, []);*/

  useEffect(() => {
    PhoneService.getAll().then((initialPhone) => {
      setPerson(initialPhone);
      console.log(initialPhone);
    });
  }, []);

  //Adding records or updating records
  const addName = (event) => {
    event.preventDefault();
    let namephone;
    let changeid;
    let label;
    //Checking Similarity in the name
    const findName = persons.find(function (person) {
      changeid = person.id;
      return person.name.toLowerCase() === String(newName).toLowerCase();
    });

    //Checking Simimalrity in the Number
    const findPhone = persons.find(function (person) {
      changeid = person.id;
      return person.number.toLowerCase() === String(newPhone).toLowerCase();
    });

    const nameObject = {
      name: newName,
      number: newPhone,
      id: String(persons.length + 1),
    };

    /* Getting the hold of what is true or false in the phone number and contactname
    Adding Record to the Database*/
    if (Boolean(findName) === false && Boolean(findPhone) === false) {
      PhoneService.create(nameObject)
        .then((returnedContact) => {
          /* Adding a sucessful Message after submission*/
          setErrorMessage({
            content: `Added ${nameObject.name}`,
            type: "success",
          });
          setTimeout(() => {
            setErrorMessage({ content: ``, type: "normal" });
          }, 5000);
          /*End of sucessful message*/

          setPerson(persons.concat(returnedContact));
          setNewNames("");
          setNewPhones("");
        })
        .catch((error) => {
          /* Adding a sucessful Message after submission*/
          setErrorMessage({
            content: `Contact ${nameObject.name} could not be added to the Database. Reason: ${error}`,
            type: "error",
          });
          setTimeout(() => {
            setErrorMessage({ content: ``, type: "normal" });
          }, 5000);
          /*End of sucessful message*/
        });
    } else {
      if (Boolean(findName) === true) {
        namephone = newName;
        label = "number";
      } else {
        namephone = newPhone;
        label = "Name";
      }

      if (
        window.confirm(
          `${namephone} is already added to phonebook, replace the old ${label} with the new one?`
        )
      ) {
        const person = persons.find((n) => n.id === changeid);
        const changedNote = { ...person, name: newName, number: newPhone };
        PhoneService.update(changeid, changedNote)
          .then((returnedContact) => {
            /* Adding a sucessful Message after submission*/
            setErrorMessage({
              content: `Contact ${nameObject.name} Successfully Updated to the Database`,
              type: "success",
            });
            setTimeout(() => {
              setErrorMessage({ content: ``, type: "normal" });
            }, 5000);
            /*End of sucessful message*/
            setPerson(
              persons.map((person) =>
                person.id === changeid ? returnedContact : person
              )
            );
          })
          .catch((error) => {
            //alert(`the note '${namephone}' was already deleted from server`);
            // Adding a sucessful Message after submission
            setErrorMessage({
              content: `Contact ${namephone} could not be updated to the Database. Reason: ${error}`,
              type: "error",
            });
            setTimeout(() => {
              setErrorMessage({ content: ``, type: "normal" });
            }, 5000);
            /*End of sucessful message*/
            setPerson(persons.filter((n) => n.id !== id));
          });
      }
    }
  };

  const handleNameChange = (event) => {
    setNewNames(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setNewPhones(event.target.value);
  };

  const handleFindChange = (event) => {
    setFindContact(event.target.value);

    if (String(findContact).length > 0) {
      setShowAll(false);
    } else {
      setShowAll(true);
    }
  };

  //How to delete a record
  const deletephone = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name} ?`)) {
      PhoneService.clean(person.id)
        .then((returnedPhone) => {
          // Adding a sucessful Message after submission
          setErrorMessage({
            content: `Contact ${person.name} Successfully Deleted from the Database`,
            type: "success",
          });

          setTimeout(() => {
            setErrorMessage({ content: ``, type: "normal" });
          }, 5000);
          /*End of sucessful message*/
          setPerson(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          //alert(`the person '${person.name}' was already deleted from server`);
          // Adding a sucessful Message after submission
          setErrorMessage({
            content: `Information of ${person.name} has already been removed from server`,
            type: "error",
          });
          setTimeout(() => {
            setErrorMessage({ content: ``, type: "normal" });
          }, 5000);
          /*End of sucessful message*/
          //setPerson(persons.filter((p) => p.id !== id));
        });
    }
  };

  /*Checking whether what is type in the keyboard has similarity with persons array content 
  And keeping aside those that have the array content*/
  const filteredNames = (Array.isArray(persons) ? persons : []).filter(
    (person) => {
      return person.name
        ?.toLowerCase()
        .includes(String(findContact).toLowerCase());
    }
  );

  const contactToShow = Array.isArray(showAll ? persons : filteredNames)
    ? showAll
      ? persons
      : filteredNames
    : [];

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification messege={errorMessage} />
      <Filter findContact={findContact} handleFindChange={handleFindChange} />

      <h2>add a new</h2>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newPhone={newPhone}
        handlePhoneChange={handlePhoneChange}
      />
      <h2>Numbers</h2>
      {/* {console.log(contactToShow)} */}
      {/* {console.log(persons)} */}
      <Phone contactToShow={contactToShow} deletephone={deletephone} />
    </div>
  );
};

export default App;
