import React from 'react'
import {BrowserRouter as Router, Redirect, Route} from 'react-router-dom';

import SignUpPage from './components/registration/SignUpPage';
import SignInPage from './components/signin/SignInPage'
import HomePage from './components/home/HomePage';

import * as ROUTES from './constants/routes';
import { withAuthentication } from './components/session';

const App = () => (
    <Router>
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Redirect exact path={ROUTES.LANDING} to={ROUTES.HOME} />
    </Router>
)

export default withAuthentication(App);
