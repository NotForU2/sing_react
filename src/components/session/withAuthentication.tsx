import React from 'react';
import { AuthUserContext } from '../session';
import Firebase, { withFirebase } from '../firebase';


interface Props {
    firebase: Firebase,
    listener: any
}

interface State {
    authUser: any,
    updateUser: () => void;
}

const withAuthentication = (Component: any) => {
    class WithAuthentication extends React.Component<Props, State> {
        listener: any;
        updateUser: () => void;
        constructor(props: any) {
            super(props)

            this.updateUser = async () => {
                 return this.props?.firebase?.updateUser()?.then((authUser: any) => {
                            localStorage.setItem('authUser', JSON.stringify(authUser));
                            this.setState({ authUser: authUser })
                            return authUser
                        });
            }

            this.state = {
                authUser: JSON.parse(localStorage.getItem('authUser') || 'null'),
                updateUser: this.updateUser
            }
        }

        componentDidMount() {
            this.listener = this.props.firebase.onAuthUserListener((authUser: any) => {
                if (authUser) {
                    localStorage.setItem('authUser', JSON.stringify(authUser));
                    this.setState({ authUser });
                }
            }, () => {
                localStorage.removeItem('authUser');
                this.setState({ authUser: null })
            });
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Provider value={this.state}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            );
        }
    }
    return withFirebase(WithAuthentication);
};

export default withAuthentication