import {validateRegistration, validateSignIn} from '../../../utils/useForm';
import ReactTooltip from 'react-tooltip';
import {Link} from 'react-router-dom';
import './SignInForm.scss';
import openEye from '../../../images/open-eye.svg';
import closeEye from '../../../images/close-eye.svg';
import info from '../../../images/tooltip.svg'

import React from 'react'
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Firebase, { withFirebase } from '../../firebase';
import * as ROUTES from '../../../constants/routes';

const INITIAL_STATE = {
    email: '',
    password: '',
    showPass: false,
    errors: {},
    isSubmitting: false,
};

interface Props {
    firebase: Firebase,
    history: any
}

interface State {
    email: string,
    password: string,
    showPass: boolean,
    errors: any,
    isSubmitting: boolean
}

class SignInFormBase extends React.Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = { ...INITIAL_STATE};
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.toggleShowPassword = this.toggleShowPassword.bind(this);
    }

    onSubmit = (event: any) => {
        const {email, password} = this.state;
        const errors = validateSignIn({email, password});

        if (event) event.preventDefault();
        this.setState(prevState => ({
            ...prevState,
            errors: errors,
            isSubmitting: true
        }));

        if (Object.keys(errors).length === 0) {
            this.props.firebase
                .doSignInWithEmailAndPassword(email, password)
                .then(() => {
                    this.setState({ ...INITIAL_STATE});
                    this.props.history.push(ROUTES.HOME);
                })
                .catch(error => {
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
    };

    onChange = (event: any ) => {
        const { isSubmitting } = this.state;

        if (isSubmitting) {
            const {email, password} = this.state;
            const values = {email, password};

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
    };

    render() {
        const { email, password, errors, showPass } = this.state;

        return (
            <div className='sign-in-block'>
                <div className="sign-in-caption">
                    <p className="sign-in-caption-greeting">Вход</p>
                    <span className="sign-in-caption-offer">Новичек на Median?
                    <Link to={ROUTES.SIGN_UP} style={{ textDecoration: 'none' }}>
                        <span className="reg-link">Создать аккаунт</span>
                    </Link>
                </span>
                </div>
                <div className="sign-in-form-block">
                    <form className= "sign-in-form" onSubmit={this.onSubmit} noValidate>
                        <div className="form-field">
                            <label htmlFor="emailInput" className="label">Логин</label>
                            <input type="email"
                                   className={`input-field ${errors?.email && 'has-error'}`}
                                   autoComplete="off"
                                   name="email"
                                   placeholder="Введите свой email адрес"
                                   onChange={this.onChange}
                                   value={email}/>
                            { errors?.email && <span className="error-msg">{errors?.email}</span> }
                        </div>
                        <div className="form-field">
                            <label htmlFor="passwordInput">Пароль</label>
                            <input type={showPass ? "text" : "password"}
                                   className={`input-field ${errors?.password && "has-error"}`}
                                   name="password"
                                   placeholder="Введите свой пароль"
                                   onChange={this.onChange}
                                   value={password}/>
                            <img src={showPass ? openEye : closeEye}
                                 data-binding="password"
                                 alt="Open Eye"
                                 className="eye-icon password"
                                 onClick={this.toggleShowPassword}
                            />
                            { errors?.password &&
                            <span className="error-msg">
                                {errors?.password}
                                    <img data-for="info-svg"
                                         data-tip='Пароль должен содержать, как минимум 1 большой символ, быть длиной от 8 символов и одну цифру'
                                         data-event='click focus'
                                         src={info}
                                         alt="Подсказка"/>
                                <ReactTooltip id="info-svg" globalEventOff='click' place='bottom' />
                            </span> }
                        </div>
                        <button  disabled={errors.submit == 'auth/user-not-found'} type="submit">Войти</button>
                        { errors?.submit &&
                        <span className="error-msg submit">
                                Такой пары логин/пароль не существует
                        </span> }
                    </form>
                </div>
            </div>
        )
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase
)(SignInFormBase);

export default SignInForm;