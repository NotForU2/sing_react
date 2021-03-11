import React from 'react';
import MailVerificationHeader from "./header/MailVerificationHeader";
import MailVerification from './main/MailVerification';

interface Props {
    needsEmailVerification: (authUser: any) => boolean,
    onSendEmailVerification: () => void
}

interface State {
    foo?: number
}

class MailVerificationPage extends React.Component<Props, State>{
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div>
                <MailVerificationHeader />
                <MailVerification {...this.props} />
            </div>
        );
    }
}

export default MailVerificationPage;