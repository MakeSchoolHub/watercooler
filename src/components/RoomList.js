/* Acknoledgements:
 * Abhi, Ashab, Franklin, Muhammad
 * This tutorial: https://tinyurl.com/y6x4n8s3
 */
import React, { useState, useEffect } from 'react';
import {
    Link,
    useHistory
  } from "react-router-dom";
import {
    Jumbotron,
    Spinner,
    ListGroup,
    ListGroupItem,
    Button
} from 'reactstrap';
import Moment from 'moment';
import firebase from '../Firebase';

function RoomList() {
  /* A component for show a list of available rooms to join.
   */
   const [room, setRoom] = useState([]);
   // trigger load spinner
   const [showLoading, setShowLoading] = useState(true);
   const [nickname, setNickname] = useState('');
   const history = useHistory();
   // Load room list from Firebase Realtime-Database
   useEffect(() => {
       const fetchData = async () => {
           setNickname(localStorage.getItem('nickname'));
           firebase.database().ref('rooms/').on('value', resp => {
               setRoom([]);
               setRoom(snapshotToArray(resp));
               setShowLoading(false);
           });
       };

       fetchData();
   }, []);
   // Extract array of objects from Firebase response
   const snapshotToArray = (snapshot) => {
     const returnArr = [];

     snapshot.forEach((childSnapshot) => {
         const item = childSnapshot.val();
         item.key = childSnapshot.key;
         returnArr.push(item);
     });

     return returnArr;
   }
   // Enter chatroom and send chatroom status to Firebase
   const enterChatRoom = (roomname) => {
       const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
       chat.roomname = roomname;
       chat.nickname = nickname;
       chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
       chat.message = `${nickname} enter the room`;
       chat.type = 'join';
       const newMessage = firebase.database().ref('chats/').push();
       newMessage.set(chat);

       firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(roomname).on('value', (resp) => {
           let roomuser = [];
           roomuser = snapshotToArray(resp);
           const user = roomuser.find(x => x.nickname === nickname);
           if (user !== undefined) {
             const userRef = firebase.database().ref('roomusers/' + user.key);
             userRef.update({status: 'online'});
           } else {
             const newroomuser = { roomname: '', nickname: '', status: '' };
             newroomuser.roomname = roomname;
             newroomuser.nickname = nickname;
             newroomuser.status = 'online';
             const newRoomUser = firebase.database().ref('roomusers/').push();
             newRoomUser.set(newroomuser);
           }
       });

       history.push('/chatroom/' + roomname);
   }
   // Add logout
   const logout = () => {
       localStorage.removeItem('nickname');
       history.push('/login');
   }
   return (
       <div>
           {showLoading &&
               <Spinner color="primary" />
           }
           <Jumbotron>
               <h3>{nickname} <Button onClick={() => { logout() }}>Logout</Button></h3>
               <h2>Room List</h2>
               <div>
                   <Link to="/addroom">Add Room</Link>
               </div>
               <ListGroup>
                   {room.map((item, idx) => (
                       <ListGroupItem key={idx} action onClick={() => { enterChatRoom(item.roomname) }}>{item.roomname}</ListGroupItem>
                   ))}
               </ListGroup>
           </Jumbotron>
       </div>
   );
}

export default RoomList;
