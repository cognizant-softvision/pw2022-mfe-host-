import React, { useEffect, useRef, ReactNode, useState, FC, Component, ErrorInfo } from "react";
import { useLocation } from "react-router-dom";
import ErrorPage from "pages/ErrorPage";

class RealErrorBoundary extends Component {
  state = { error: undefined };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.props.setTrackPathChange(true);
  }

  render() {
    const { errorComponent } = this.props;
    if (this.state.error) {
      return errorComponent || <ErrorPage />;
    } else {
      return this.props.children;
    }
  }
}
function usePrevious(value) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
// this "fake" error boundary will reset the "real" error boundary
// whenever a pathname change happens _after_ an error

const ErrorBoundary = ({ children, errorComponent }) => {
  const [key, setKey] = useState(0);
  const { pathname } = useLocation();
  const previousPathname = usePrevious(pathname);
  const [trackPathChange, setTrackPathChange] = useState(false);

  useEffect(() => {
    if (trackPathChange && previousPathname !== pathname) {
      setKey(key => key + 1);
      setTrackPathChange(false);
    }
  }, [trackPathChange, previousPathname, pathname]);

  return (
    <RealErrorBoundary key={key} setTrackPathChange={setTrackPathChange} errorComponent={errorComponent}>
      {children}
    </RealErrorBoundary>
  );
};

export default ErrorBoundary;