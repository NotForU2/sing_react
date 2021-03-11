import React from 'react';

import AuthUserContext from './context';
import Firebase, { withFirebase } from '../firebase';
import MailVerificationPage from "../verification/MailVerificationPage";

interface Props {
    firebase: Firebase,
    history: any
}

interface State {
    isSent: boolean
}

const needsEmailVerification = (authUser: any) =>
    authUser &&
    !authUser.emailVerified &&
    authUser.providerData
        .map((provider: any) => provider.providerId)
        .includes('password');

const withEmailVerification = (Component: any) => {
    class WithEmailVerification extends React.Component<Props, State> {
        constructor(props: any) {
            super(props);

            this.state = {
                isSent: false
            };
        }

        onSendEmailVerification = () => {
            this.props?.firebase
                ?.doSendEmailVerification()
                ?.then(() => this.setState({ isSent: true }));
        };

        render() {
            return (
                <AuthUserContext.Consumer>
                    {({authUser}) =>
                        needsEmailVerification(authUser) ? (
                            <MailVerificationPage needsEmailVerification={needsEmailVerification}
                                                  onSendEmailVerification={this.onSendEmailVerification} />
                        ) : (
                            <Component {...this.props} />
                        )
                    }
                </AuthUserContext.Consumer>
            );
        }
    }

    return withFirebase(WithEmailVerification);
};

export default withEmailVerification;