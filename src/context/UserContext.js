import React, { useReducer, createContext} from "react";

const LOGIN_ON = true;

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
  let user = JSON.parse(jsonPayload)
  return user;
};

const emptyState = {
  name: '',
  logged: false
}

const mockedLoginInitialState = {
  name: 'John Doe',
  logged: true
}

const initialState = !LOGIN_ON ? mockedLoginInitialState : emptyState;

// action creators
const setUser = (payload) => ({ type: 'login', payload})
const logout = () => ({ type: 'logout'})

const reducer = (state, action) => {
  switch (action.type) {
    case "login":
      return { ...state, logged: true, name: action.payload };
    case "logout":
      // login not mocked here, to allow devs to manually logout
      return emptyState;
    default:
      return state;
  }
};

const UserContext = createContext(null);

const UserContextProvider = ({ children }) => (
  <UserContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </UserContext.Provider>
);

export { UserContextProvider, UserContext, setUser, logout };