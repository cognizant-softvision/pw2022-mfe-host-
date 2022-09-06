import React from 'react';

import './ErrorComponent.css';

const ErrorComponent = ({
  message = "Component not available",
}) => (
  <div className="errorWrapper">
    <h1>{message}</h1>
  </div>
);
export default ErrorComponent;
