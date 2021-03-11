import React from 'react';
import SignUpForm from "./form/SignUpForm";
import SignUpHeader from "./header/SignUpHeader";

class SignUpPage extends React.Component{
    render() {
        return (
            <div>
                <SignUpHeader/>
                <SignUpForm/>
            </div>
        );
    }
}

export default SignUpPage;