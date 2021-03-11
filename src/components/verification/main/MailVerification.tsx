import React from "react";
import {compose} from "recompose";
import AuthUserContext from '../../session/context';
import './MailVerification.scss'
import {withAuthorization} from "../../session";
import {withRouter} from "react-router-dom";
import * as ROUTES from "../../../constants/routes";

interface State {
    isSent: boolean
    verified: boolean
    seconds: number
    intervalId: NodeJS.Timeout | undefined
}

interface Props {
    needsEmailVerification: (authUser: any) => boolean,
    onSendEmailVerification: () => void,
    history: any
}

class MailVerificationBase extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            isSent: true,
            verified: true,
            seconds: 120,
            intervalId: undefined
        }

        this.sendEmail = this.sendEmail.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
    }

    componentDidMount() {
        this.sendEmail();
    }

    componentWillUnmount() {
        if(this.state.intervalId) {
            clearInterval(this.state.intervalId);
            this.setState({intervalId: undefined})
        }
    }

    sendEmail = () => {
        this.props.onSendEmailVerification();
        const intervalId = setInterval(this.timer, 1000);
        this.setState({
            intervalId: intervalId,
            isSent: true,
            verified: true
        });
    }

    timer = () => {
        if(this.state.isSent) {
            const newSeconds = this.state.seconds - 1;
            this.setState({seconds: newSeconds})
            if(newSeconds == 0) {
                this.setState({
                    isSent: false
                })
            }
        }
        else if (this.state.intervalId){
            clearInterval(this.state.intervalId);
            this.setState({
                intervalId: undefined,
                seconds: 120
            })
        }
    }

    secondsToTime = (seconds: number) => {
        return `${Math.floor(seconds/60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
    }

    onClickSubmit = (event: any, updateUser: any) => {
        event.preventDefault();
        updateUser().then((user:any) => {
            if (!this.props.needsEmailVerification(user)) {
                this.setState({
                    verified: true
                })
                this.props.history.push(ROUTES.HOME);
            }
            else {
                this.setState({
                    verified: false
                })
            }
        });

    }


    render() {
        const { isSent, seconds, intervalId, verified } = this.state;

        return (
            <AuthUserContext.Consumer>
                {
                    ({authUser, updateUser}) => (
                        <div className="verification-block">
                            <div className="verification-caption">
                                <span className="verification-caption-greeting">Подтвердите свой email</span>
                                <span className="verification-caption-offer">На адресс <span className="user-email">{authUser.email}</span> отправлено письмо,
                                перйдите по ссылке для подтвержения.</span>
                            </div>
                            <div className="verification-form-block">
                                <div className="verification-form">
                                    <div className='verification-form-block-offer'>
                                        <span className="verification-form-offer-msg">Не получили письмо?
                                        <span className={`send-email ${isSent && 'sent'}`}
                                              onClick={() => {
                                                  if (!intervalId) {
                                                      this.sendEmail()
                                                  }
                                              }}>
                                              Отправить заново
                                        </span>
                                    </span>
                                        <span className="timer">
                                        {intervalId && this.secondsToTime(seconds)}
                                    </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e:any) => {
                                            this.onClickSubmit(e, updateUser);
                                        }}>
                                        Завершить регистрацию
                                    </button>
                                    { !verified &&
                                    <span className="error-msg submit">
                                    Вы не подтвердили почту
                                    </span> }
                                </div>
                            </div>
                        </div>
                    )
                }
            </AuthUserContext.Consumer>

        );
    }
}

const condition = (authUser: any) => !!authUser;

const MailVerification = compose(
    withRouter,
    withAuthorization(condition)
)(MailVerificationBase);

export default MailVerification;