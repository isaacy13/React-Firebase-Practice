import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyD1AXUSmuzPBlVDHcqMlaTuzHoDWMfIKDw",
  authDomain: "first-react-firebase-app-12757.firebaseapp.com",
  projectId: "first-react-firebase-app-12757",
  storageBucket: "first-react-firebase-app-12757.appspot.com",
  messagingSenderId: "551049861804",
  appId: "1:551049861804:web:45be302bf78f0ac8e4dd09",
  measurementId: "G-Z8BC51P0ZL"
})


const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
      </header>
      <section>
        { user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign In with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  console.log(messagesRef.get());
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <SignOut />
      <h1>Chat Room</h1>
      
      <main>
        {messages && messages.map(msg => <ChatMessage key="msg.id" message={msg}/>)}
        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </>
  )

}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = (uid === auth.currentUser.uid) ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="User PFP"/>
      <p>{text}</p>
    </div>
  )
}

export default App;
