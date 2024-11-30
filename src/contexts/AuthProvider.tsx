import {
  collection,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import React from 'react';
import {createContext, useEffect, useState} from 'react';

import {db} from '@config/firebase';
import {WEB_CLIENT_ID} from '@env';
import usePushNotification from  '@hooks/usePushNotification';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';


export const AuthContext = createContext<any>(null);

const AuthProvider = ({children}: any) => {
  const [user, setUser] = useState<any>(auth().currentUser);
  const {getFCMToken} = usePushNotification();

  useEffect(() => {
    async function init() {
      const has = await GoogleSignin.hasPlayServices();
      if (has) {
        GoogleSignin.configure({
          webClientId: WEB_CLIENT_ID,
        });
      }
    }
    init();
  }, []);

  const googleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const onLogout = () => {
    auth()
      .signOut()
      .then(() => console.info('User signed out!'))
      .catch(error => console.error('Error signing out:', error));
  };

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user) {
      const messagesRef = collection(db, 'users');
      // Query messages where the user and friend are involved
      const q = query(
        messagesRef,
        where('name', '==', user?.email), // Either user is the sender or friend is the sender
      );
      getDocs(q)
        .then(snapshot => {
          if (snapshot.empty) {
            console.info('No users found.');
          } else {
            // Extract user data from the snapshot
            const usersList: any = snapshot.docs.map(doc => ({
              ID: doc.id,
              ...doc.data(),
            }));
            const userdetails = {...(user as any)._user, ...usersList[0]};
            setUser(userdetails);
            setFcmToken(userdetails?.ID);
            // You can store the users in state here (if needed)
          }
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    } else {
      setUser(null);
    }
  }

  async function setFcmToken(usersId: string) {
    const fcmToken = await getFCMToken();
    updateDoc(doc(db, 'users', usersId), {
      fcmToken,
    });
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        googleSignOut,
        user,
        setUser,
        onLogout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
