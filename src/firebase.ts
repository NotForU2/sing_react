import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA9WZB5N6ekNxyN3yGaUwjuBilvXItUv38",
    authDomain: "fir-auth-article.firebaseapp.com",
    databaseURL: "https://fir-auth-article.firebaseio.com",
    projectId: "fir-auth-article",
    storageBucket: "fir-auth-article.appspot.com",
    messagingSenderId: "774252759419",
    appId: "1:774252759419:web:e014ddfa3553a4832a15de",
    measurementId: "G-77Z5WJ0SET"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const generateUserDocument = async (user: firebase.User | null) => {
    if (!user) return;

    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
        const { email } = user;
        try {
            await userRef.set({
                email,
            });
        } catch (error) {
            console.error("Error creating user document", error);
        }
    }
    return getUserDocument(user.uid);
};

const getUserDocument = async (uid: string) => {
    if (!uid) return null;
    try {
        const userDocument = await firestore.doc(`users/${uid}`).get();

        return {
            uid,
            ...userDocument.data()
        };
    } catch (error) {
        console.error("Error fetching user", error);
    }
};