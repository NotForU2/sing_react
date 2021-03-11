import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
}

class Firebase {

    auth: app.auth.Auth;
    db: app.database.Database;

    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.database();
    }

    onAuthUserListener = (next: any, fallback: any) =>
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.user(authUser.uid)
                    .once('value')
                    .then(snapshot => {
                        const dbUser = snapshot.val();

                        authUser = {
                            uid: authUser?.uid,
                            email: authUser?.email,
                            emailVerified: authUser?.emailVerified,
                            providerData: authUser?.providerData,
                            ...dbUser,
                        };

                        next(authUser);
                    });
            } else {
                fallback();
            }
        });

    doCreateUserWithEmailAndPassword = (email: string, password: string) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email: string, password: string) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSendEmailVerification = () =>
        this.auth.currentUser?.sendEmailVerification();

    doSignOut = () => this.auth.signOut();

    updateUser = async () => {
        return this.auth.currentUser?.reload()
                    .then(()=> {
                        return this.auth.currentUser;
                    })
                    .then((authUser: any) => {
                        return {
                            uid: authUser?.uid,
                            email: authUser?.email,
                            emailVerified: authUser?.emailVerified,
                            providerData: authUser?.providerData
                        };
                    })
    }
    user = (uid: string) => this.db.ref(`users/${uid}`);

    users = () => this.db.ref(`users`);
}

export default Firebase;