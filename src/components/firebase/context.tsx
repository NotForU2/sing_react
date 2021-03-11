import React from 'react';
import Firebase from './firebase';

const FirebaseContext = React.createContext<Firebase|null>(null);

export const withFirebase = (Component: any) => {
    const withFirebaseComponent = (props: any) => (
        <FirebaseContext.Consumer>
            {(firebase: any) => <Component {...props} firebase={firebase}/>}
        </FirebaseContext.Consumer>
    );
    return withFirebaseComponent;
}

export default FirebaseContext;