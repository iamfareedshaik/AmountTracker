import React from "react";
import ContactsComponent from "../../../components/ContactsComponent";

const AddedPeopleScreen = ({ route }) => {
  const { addedPeople } = route.params;
  return <ContactsComponent addedPeople={addedPeople} />;
};

export default AddedPeopleScreen;
