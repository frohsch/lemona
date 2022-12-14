import React, { useState, useEffect } from "react";
import AppRouter from "./Router";
import { authService } from "../firebase_";
import { updateProfile } from "@firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [newName, setNewName] = useState("");
  // 렌더링만을 위한 state(newName)

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        if (user.displayName === null) {
          updateProfile(user, { displayName: "anonymous" })
        }
        setUserObj({
          displayName: user.displayName ? user.displayName : 'Anonymous',
          uid: user.uid,
          updateProfile: (args) => updateProfile(user, { displayName: user.displayName }),
        });

      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setNewName(user.displayName);
  };
  return (
    <>

      <div className="Initializing">
        {init ? (
          <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} />
        ) : (
          "Initializing..."
        )}
      </div>
    </>
  );
}


export default App;
