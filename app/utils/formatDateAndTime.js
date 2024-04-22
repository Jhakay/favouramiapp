const formatDateAndTime = (dateObj) => {
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
    
    const formattedDate = dateObj.toLocaleDateString('en-UK', optionsDate);
    const formattedTime = dateObj.toLocaleTimeString('en-UK', optionsTime);
  
    return { formattedDate, formattedTime };
  };

  export default formatDateAndTime;