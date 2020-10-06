/* Acknoledgements:
 * Abhi, Ashab, Franklin, Muhammad
 * This tutorial: https://tinyurl.com/y6x4n8s3
 */
import React, { useState } from 'react';
import {
    useHistory
} from "react-router-dom";
import {
    Alert,
    Jumbotron,
    Spinner,
    Form,
    Button,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import firebase from '../Firebase';


function AddRoom() {
  /* A component for creating a new chat room.
   */
   const history = useHistory();
   const [room, setRoom] = useState({ roomname: '' });
   // Tricker spinner
   const [showLoading, setShowLoading] = useState(false);
   // Firebase DB reference
   const ref = firebase.database().ref('rooms/');
   // Save the chat room
   const save = (e) => {
    e.preventDefault();
    setShowLoading(true);
    ref.orderByChild('roomname').equalTo(room.roomname).once('value', snapshot => {
        if (snapshot.exists()) {
            return (
                <div>
                    <Alert color="primary">
                        Room name already exist!
                    </Alert>
                </div>
            );
        } else {
            const newRoom = firebase.database().ref('rooms/').push();
            newRoom.set(room);
            history.goBack();
            setShowLoading(false);
        }
    });
  };
  // Handle input changes
  const onChange = (e) => {
      e.persist();
      setRoom({...room, [e.target.name]: e.target.value});
  }
  // Render view for add room form
  return (
    <div>
        {showLoading &&
            <Spinner color="primary" />
        }
        <Jumbotron>
            <h2>Please enter new Room</h2>
            <Form onSubmit={save}>
                <FormGroup>
                    <Label>Room Name</Label>
                    <Input type="text" name="roomname" id="roomname" placeholder="Enter Room Name" value={room.roomname} onChange={onChange} />
                </FormGroup>
                <Button variant="primary" type="submit">
                    Add
                </Button>
            </Form>
        </Jumbotron>
    </div>
  );
}

export default AddRoom;
