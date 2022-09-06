import React, { Suspense, useContext} from "react";

import Footer from "components/footer/Footer";
import ErrorBoundary from "components/ErrorBoundary";
import ErrorComponent from  'components/errorComponent/ErrorComponent.jsx'
import { logout, UserContext } from "context/UserContext";

// REMOTE NAV BAR:
const TopBar = React.lazy(() => import("ReactComponents/Topbar"));

export const Layout = ({ children }) => {
  const [user, dispatch] = useContext(UserContext);

  return (
    <div className="" key="Layout">
      <ErrorBoundary errorComponent={<ErrorComponent />}>
          <Suspense fallback={<span>loading...</span>}>
            <TopBar name={user.name} logged={user.logged} logout={() => dispatch(logout())} />
          </Suspense>
        </ErrorBoundary>
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
