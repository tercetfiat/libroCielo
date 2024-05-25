import React, { useState, useEffect } from 'react';

function LibroCielo() {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch('/libro-cielo.html')
      .then(response => response.text())
      .then(html => setHtmlContent(html))
      .catch(error => console.error('Error fetching HTML:', error));
  }, []); 

  return (
    <div>
      {/* ... other content ... */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> 
    </div>
  );
}

export default LibroCielo;