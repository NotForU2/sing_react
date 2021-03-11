import React from 'react';
import './SignUpHeader.scss'
import {Link} from 'react-router-dom'
import * as ROUTES from '../../../constants/routes';

class SignUpHeader extends React.Component {
    render() {
        return (
            <div className="reg-header">
                <p className="company-name">Median</p>
                <div className="button-block">
                    <p className="offer-msg">Вы уже с нами?</p>
                    <Link to={ROUTES.SIGN_IN} style={{ textDecoration: 'none' }}>
                        <button className="action-auth-button"><span>Войти</span></button>
                    </Link>
                </div>
            </div>
        );
    }
}

export default SignUpHeader;