import React from 'react';
import {withAuthorization, withEmailVerification} from '../session';
import {compose} from "recompose";
import SignOutButton from "../signout/SignOut";


const HomePage = () => {
    return (
        <div>
            <h1>HomePage</h1>
            <p>HomePage page is accessible by every singed in user.</p>
            <SignOutButton />
        </div>
    )
}

const condition = (authUser: any) => !!authUser;

export default compose(
    withEmailVerification,
    withAuthorization(condition),
)(HomePage);