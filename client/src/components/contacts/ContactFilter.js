import React, { useContext } from 'react';
import ContactContext from '../../context/contact/contactContext';

const ContactFilter = () => {
  const contactContext = useContext(ContactContext);

  const { clearFilter, filterContacts } = contactContext;

  const onChange = (e) => {
    if (e.target.value.length > 0) {
      filterContacts(e.target.value);
    } else {
      clearFilter();
    }
  };

  return (
    <form>
      <input type="text" placeholder="Filter Contacts..." onChange={onChange} />
    </form>
  );
};

export default ContactFilter;
