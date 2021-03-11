import React from 'react';
import SignInForm from "./form/SignInForm";
import SignInHeader from "./header/SignInHeader";


class SignUpPage extends React.Component{
    render() {
        return (
            <div>
                <SignInHeader/>
                <SignInForm/>
            </div>
        );
    }
}


export default SignUpPage;