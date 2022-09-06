import React, { useContext, Suspense } from 'react';

import { logout, UserContext } from "context/UserContext";
import ErrorBoundary from "components/ErrorBoundary";
import ErrorComponent from  'components/errorComponent/ErrorComponent.jsx'
// REMOTE NAV BAR:
const TopBar = React.lazy(() => import("ReactComponents/Topbar"));


const PublicLayout = ({ children }) => 
{
  const [user, dispatch] = useContext(UserContext);
  return (

    <div className="publicLayoutContainer">
        <ErrorBoundary errorComponent={<ErrorComponent />}>
          <Suspense fallback={<span>loading...</span>}>
            <TopBar name={user.name} logged={user.logged} logout={() => dispatch(logout())} />
          </Suspense>
        </ErrorBoundary>
        {children}
    </div>
  )};

  export default PublicLayout