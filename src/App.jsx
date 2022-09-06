import React, { useEffect, useRef, useContext, Suspense, useState, lazy } from "react";
import { BrowserRouter, Routes, Route, Outlet, useNavigate, useLocation } from "react-router-dom";

import { UserContextProvider, UserContext, setUser } from "context/UserContext";

import Home from "pages/home/Home";
import ErrorPage from "pages/ErrorPage";
import PublicHome from "pages/public-home/PublicHome";

import Layout from "components/layout/Layout";
import ErrorBoundary from "components/ErrorBoundary";
import ErrorComponent from "components/errorComponent/ErrorComponent";
import PublicLayout from "components/public-layout/PublicLayout";


function Entry() {
  const [user, dispatch] = useContext(UserContext);
  const ceRef = useRef(null);

  const [isLoginDefined, setLoginDefined] = useState(true)
  const [isWCDemoAppDefined, setWCDemoAppDefined] = useState(true)

  const navigate = useNavigate();

  const location = useLocation()


  function handleSuccessLoginResponse(response) {
    console.log({response});
    const { user } = response.detail;
    // Back end call not implemented: verification and claims (role, community, pictures)
    
    dispatch(setUser(user));
    navigate('/', {replace: true} )
  }
  // WEB COMPONENT MICRO FRONTENDS
  const WCDemo = () => isWCDemoAppDefined ? <cwc-foundations></cwc-foundations> : <ErrorComponent />

  const Login = () =>
    isLoginDefined ? (
      <cwc-login
        ref={ceRef}
        prompt="Sign in with your account"
        description="Welcome to Programmer's Week"
      >
        <img style={{ marginTop: "196px"}} slot="titleLogo" src="assets/logo.png" alt="Cognizant Softvision" />
      </cwc-login>
    ) : (
      <ErrorComponent message="404. Not available" />
    );

  useEffect(() => {
    import("WebComponents/login")
      .then((module) => setLoginDefined(true))
      .catch((module) => setLoginDefined(false))

    import("StandaloneMFE/App")
      .then((module) => setWCDemoAppDefined(true))
      .catch((module) => setWCDemoAppDefined(false))
  },[])

  useEffect(() => {
    if (ceRef.current) {
      ceRef.current.addEventListener("success", handleSuccessLoginResponse);
      // ceRef.current.addEventListener('failure', onFailure);
    }

  }, [ceRef.current, location.pathname]);

  if (!user.logged)
    return (
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<PublicLayout><Outlet /></PublicLayout>} >
              <Route path="/" element={<PublicHome />} />
              <Route path="/about" element={<PublicHome />} />
              <Route path="/join" element={<PublicHome />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </ErrorBoundary>
    );

  /* 
  Notes on sub-routing MFE with react router: Wildcard (*) is key.
  Notice foundation is passes this way: /foundations/*. That means.. from that poin on, match this copmonent, 
  so router on host will point to MFE and the remote will take care of routing.
  On remote side... <Lnks> should be relative(no "/" ont the To prop).
  */
  return (
      <ErrorBoundary>
        <Suspense fallback={<Layout><h1><mark>...loading</mark></h1></Layout>}>
          <Routes>
            <Route path="/foundations/*" element={<WCDemo />} />
            <Route path="/" element={
                <Layout>
                  <Outlet />
                </Layout>
              } >
              {/* here routes that use main layout */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<h1>About</h1>} />
              <Route path="/join" element={<h1>Join us!</h1>} />
            </Route>
            <Route path="*" element={<ErrorPage message="404 Page not found" />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
  );
}

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Entry />
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
