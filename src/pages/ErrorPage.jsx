import React from 'react'

import ErrorComponent from "components/errorComponent/ErrorComponent";
import LayoutConnected from "components/layout/Layout";

const ErrorPage = ({ message = "Page not available" }) => {
  return (
    <LayoutConnected>
      <ErrorComponent message={message} />
    </LayoutConnected>
  );
};

export default ErrorPage;
