import React from 'react';
import './SignInHeader.scss';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

class SignInHeader extends React.Component {
    render() {
        return (<div className="sign-in-header">
            <p className="company-name">Median</p>
            <div className="button-block">
                <p className="offer-msg">Нет аккаунта?</p>
                <Link to={ROUTES.SIGN_UP} style={{ textDecoration: 'none' }}>
                    <button className="action-auth-button"><span>Создать новый</span></button>
                </Link>
            </div>
        </div>);
    }
}

export default SignInHeader;