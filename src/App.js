if (process.env.NODE_ENV !== 'production') {
  //// .env files shouldn't be used in production
  // load .env file
  require('dotenv').config();
}

import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation
} from "react-router-dom";
import Login from './components/Login';
import RoomList from './components/RoomList';
import AddRoom from './components/AddRoom';
import ChatRoom from './components/ChatRoom';

function SecureRoute({ children, ...rest }) {
  /* Filter visitors by logged-in users.
   * Redirect if not logged-in 
   */
  return (
    <Route
      {...rest}
      render={({ location }) =>
        localStorage.getItem('nickname') ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function App() {
  let location = useLocation();

  return (
    <Router>
      <div>
        <Redirect
          to={{
            pathname: "/roomlist",
            state: { from: location }
          }}
        />
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <SecureRoute path="/roomlist">
            <RoomList />
          </SecureRoute>
          <SecureRoute path="/addroom">
            <AddRoom />
          </SecureRoute>
          <SecureRoute path="/chatroom/:room">
            <ChatRoom />
          </SecureRoute>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
