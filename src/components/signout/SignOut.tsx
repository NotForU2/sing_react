import React from 'react'
import { withFirebase } from '../firebase';
import {compose} from "recompose";

const SignOutButtonBase = ({firebase}: any) => (
    <button type="button" onClick={firebase.doSignOut}>
        Sign Out
    </button>
)

const SignOutButton = compose(
    withFirebase
)(SignOutButtonBase)

export default SignOutButton