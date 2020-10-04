import React from "react";
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase";
import "firebase/auth";

export const AppContext = React.createContext(null);

const firebaseConfig = {
  apiKey: "AIzaSyApxPbUfIQ1CgANNyTGd_nLE256Zf65oow",
  authDomain: "user-app-681c8.firebaseapp.com",
  databaseURL: "https://user-app-681c8.firebaseio.com",
  projectId: "user-app-681c8",
  storageBucket: "user-app-681c8.appspot.com",
  messagingSenderId: "593075267668",
  appId: "1:593075267668:web:9cb49a14879c4c3bfb25c1",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const AppProvider = ({ children, signInWithGoogle, signOut, user }) => {
  const [appUser, setAppUser] = React.useState({});
  const [message, setMessage] = React.useState("");

  const handleSignOut = () => {
    signOut();
    setAppUser({});
  };

  React.useEffect(() => {
    if (user) {
      fetch("/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          setAppUser(json.data);
          setMessage(json.message);
        });
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{ signInWithGoogle, appUser, handleSignOut, message }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(AppProvider);
