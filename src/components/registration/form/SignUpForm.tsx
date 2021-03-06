import React from 'react'
import { compose } from 'recompose';
import * as ROUTES from '../../../constants/routes';
import Firebase, { withFirebase } from '../../firebase';
import { Link, withRouter } from 'react-router-dom';
import openEye from "../../../images/open-eye.svg";
import closeEye from "../../../images/close-eye.svg";
import info from "../../../images/tooltip.svg";
import ReactTooltip from "react-tooltip";
import './SignUpForm.scss';
import {validateRegistration} from '../../../utils/useForm';

interface Props {
    firebase: Firebase,
    history: any,
}

interface State {
    email: string,
    password: string,
    confirmPassword: string,
    showPass: boolean,
    showConfirm: boolean,
    errors: any,
    isSubmitting: boolean
}

const INITIAL_STATE = {
    email: '',
    password: '',
    confirmPassword: '',
    showPass: false,
    showConfirm: false,
    errors: {},
    isSubmitting: false,
};

class SignUpFormBase extends React.Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = { ...INITIAL_STATE}
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.toggleShowPassword = this.toggleShowPassword.bind(this);
        this.toggleShowConfirm = this.toggleShowConfirm.bind(this);
    }

    onSubmit = (event: any) => {
        const { email, password, confirmPassword} = this.state;
        const errors = validateRegistration({email, password, confirmPassword});

        if (event) event.preventDefault();
        this.setState(prevState => ({
            ...prevState,
            errors: errors,
            isSubmitting: true
        }));

        if (Object.keys(errors).length === 0) {
            this.props.firebase
                .doCreateUserWithEmailAndPassword(email, password)
                .then((authUser: any) => {
                    return this.props.firebase
                        .user(authUser.user.uid)
                        .set({
                            email
                        });
                })
                .then(() => {
                    return this.props.firebase.doSendEmailVerification();
                })
                .then(() => {
                    this.setState({ ...INITIAL_STATE});
                    this.props.history.push(ROUTES.HOME);
                })
                .catch((error: any) => {
                    this.setState({
                        ...INITIAL_STATE,
                        isSubmitting: true,
                        errors: {
                            ...error,
                            submit: error.code
                        }
                    });
                });
        }
    }

    onChange = (event: any) => {
        const { isSubmitting } = this.state;

        if (isSubmitting) {
            const {email, password, confirmPassword} = this.state;
            const values = {email, password, confirmPassword};

            this.setState(prevState => ({
                ...prevState,
                [event.target.name]: event.target.value,
                errors: validateRegistration({
                    ...values,
                    [event.target.name]: event.target.value
                }),
            }));
        }
        else {
            //@ts-ignore
            this.setState({ [event.target.name]: event.target.value });
        }
    };

    toggleShowPassword = () => {
        this.setState({showPass: !this.state.showPass});
    }

    toggleShowConfirm = () => {
        this.setState({showConfirm: !this.state.showConfirm})
    }


    render() {
        const {
            email,
            password,
            confirmPassword,
            showPass,
            showConfirm,
            errors
        } = this.state;


        return (
            <div className='reg-block'>
                <div className="reg-caption">
                    <span className="reg-caption-greeting">???????????????? ???????????? ????????????????????????</span>
                    <span className="reg-caption-offer">?????? ?????????????????????????????????
                    <Link to={ROUTES.SIGN_IN} style={{ textDecoration: 'none' }}>
                        <span className="sign-in-link">??????????</span>
                    </Link>
                </span>
                </div>
                <div className="reg-form-block">
                    <form className= "reg-form" onSubmit={this.onSubmit} noValidate>
                        <div className="form-field">
                            <label htmlFor="emailInput" className="label">??????????</label>
                            <input type="email"
                                   className={`input-field ${errors?.email && 'has-error'}`}
                                   autoComplete="off"
                                   name="email"
                                   placeholder="?????????????? ???????? email ??????????"
                                   onChange={this.onChange}
                                   value={email}/>
                            { errors?.email && <span className="error-msg">{errors?.email}</span> }
                        </div>
                        <div className="form-field">
                            <label htmlFor="passwordInput">????????????</label>
                            <input type={showPass ? "text" : "password"}
                                   className={`input-field ${errors?.password && "has-error"}`}
                                   name="password"
                                   placeholder="?????????????? ???????? ????????????"
                                   onChange={this.onChange}
                                   value={password}/>
                            <img src={showPass ? openEye : closeEye}
                                 data-binding="password"
                                 alt="Open Eye"
                                 className="eye-icon password"
                                 onClick={this.toggleShowPassword}
                            />
                            { errors?.password && <span className="error-msg">
                            {errors?.password}
                                <img data-for="info-svg"
                                     data-tip='???????????? ???????????? ??????????????????, ?????? ?????????????? 1 ?????????????? ????????????, ???????? ???????????? ???? 8 ???????????????? ?? ???????? ??????????'
                                     data-event='click focus'
                                     src={info}
                                     alt="??????????????????"/>
                            <ReactTooltip id="info-svg" globalEventOff='click' place='bottom' />
                        </span> }
                        </div>
                        <div className="form-field">
                            <label htmlFor="passwordInput">?????????????????? ????????????</label>
                            <input type={showConfirm ? "text" : "password"}
                                   className={`input-field ${errors?.confirmPassword && "has-error"}`}
                                   name="confirmPassword"
                                   placeholder="?????????????? ???????????? ?????? ??????"
                                   onChange={this.onChange}
                                   value={confirmPassword}/>
                            <img src={showConfirm ? openEye : closeEye}
                                 alt="Open Eye"
                                 className="eye-icon password"
                                 onClick={this.toggleShowConfirm}
                            />
                            { errors?.confirmPassword && <span className="error-msg">{errors?.confirmPassword}</span> }
                        </div>
                        <button type="submit" disabled={errors?.submit == 'auth/email-already-in-use'}>??????????????</button>
                        { errors?.submit &&
                        <span className="error-msg submit">
                                ???????????????????????? ?? ?????????? ?????????????? ?????? ??????????
                        </span> }
                    </form>
                </div>
            </div>
        );
    }
}

const SignUpForm = compose(
    withRouter,
    withFirebase
)
(SignUpFormBase);


export default SignUpForm;

export { SignUpFormBase };
