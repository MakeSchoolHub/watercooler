import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import {
    Jumbotron,
    Spinner,
    Form,
    Button,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import firebase from '../Firebase';

function Login() {
  /* A component containing a form for inputing username. After submitting
   * the form to the Firebase Realtime-Database, if the submitted username
   * isn't found, it is added.
   */
  const history = useHistory();
  // Required form field
  const [creds, setCreds] = useState({ nickname: '' });
  // trigger loading
  const [showLoading, setShowLoading] = useState(false);
  // Firebase DB reference
  const ref = firebase.database().ref('users/');
  // Handle input value changes
  const onChange = (e) => {
    e.persist();
    setCreds({...creds, [e.target.name]: e.target.value});
  }
  // Submit form data to Firebase Realtime-Database
  const login = (e) => {
    e.preventDefault();
    setShowLoading(true);
    ref.orderByChild('nickname').equalTo(creds.nickname).once('value', snapshot => {
        if (snapshot.exists()) {
            localStorage.setItem('nickname', creds.nickname);
            history.push('/roomlist');
            setShowLoading(false);
        } else {
            const newUser = firebase.database().ref('users/').push();
            newUser.set(creds);
            localStorage.setItem('nickname', creds.nickname);
            history.push('/roomlist');
            setShowLoading(false);
        }
    });
  };
  // Render the login page with a loading spinng and a form for submitted
  // visitor's nickname.
  return (
    <div>
        {showLoading &&
            <Spinner color="primary" />
        }
        <Jumbotron>
            <Form onSubmit={login}>
                <FormGroup>
                    <Label>Nickname</Label>
                    <Input type="text" name="nickname" id="nickname" placeholder="Enter Your Nickname" value={creds.nickname} onChange={onChange} />
                </FormGroup>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </Jumbotron>
    </div>
    );
  }

export default Login;
