import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Firebase, { withFirebase } from '../firebase';
import * as ROUTES from '../../constants/routes';
import AuthUserContext from './context';

interface Props {
    firebase: Firebase,
    history: any
}


const withAuthorization = (condition: any) => (Component: any) => {
    class WithAuthorization extends React.Component<Props>{
        listener: any;
        constructor(props:any) {
            super(props)
            this.state = {}
        }

        componentDidMount(){
            this.listener = this.props.firebase.onAuthUserListener(
                (authUser: any) => {
                    if(!condition(authUser)) {
                        this.props.history.push(ROUTES.SIGN_IN);
                    }
                    else {
                        this.props.history.push(ROUTES.HOME);
                    }
                }, () => {
                    this.props.history.push(ROUTES.SIGN_IN);
                }
            );
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Consumer>
                    {({authUser}) => condition(authUser) ? <Component {...this.props} /> : null}
                </AuthUserContext.Consumer>
            );
        }
    }
    return compose(
        withRouter,
        withFirebase
    )(WithAuthorization);
}

export default withAuthorization;