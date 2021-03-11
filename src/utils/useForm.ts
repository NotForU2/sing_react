import React, {useState, useEffect} from 'react';
import {IErrorRegistration} from "../interfaces/IErrorRegistration";
import {IValuesFormAuth} from "../interfaces/IValuesFormAuth";
import {IFormRegistration} from "../interfaces/IFormRegistration";

type CallbackFunction = () => void;
type ValidateFunction = (values: IValuesFormAuth) => IErrorRegistration

export function useForm(callback: CallbackFunction, validate: ValidateFunction): IFormRegistration  {

    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (Object.keys(errors).length === 0 && isSubmitting) {
            callback();
        }
    }, [errors, callback, isSubmitting]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        setErrors(validate(values));
        setIsSubmitting(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues(values => ({
            ...values,
            [e.target.name]: e.target.value
        }));
    };

    useEffect(()=>{
        if(isSubmitting) {
            setErrors(validate(values));
        }
    }, [isSubmitting, setErrors, validate, values]);

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
    }
}


export function validateRegistration(values: IValuesFormAuth): IErrorRegistration {
    const errors = validateEmailAndPass(values);

    if (!values.confirmPassword) {
        Object.assign(errors, {confirmPassword: 'Введите пароль'})
    } else if (values.password != values.confirmPassword) {
        Object.assign(errors, {confirmPassword: 'Введите правильный пароль'})
    }

    return errors;
}

export function validateSignIn(values: IValuesFormAuth): IErrorRegistration {
    return validateEmailAndPass(values);
}

function validateEmailAndPass(values: IValuesFormAuth): IErrorRegistration {
    const errors: IErrorRegistration = {};

    if (!values.email) {
        Object.assign(errors, {email: 'Введите логин'})
    } else if (!RegExp('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,64}').test(values.email)) {
        Object.assign(errors, {email: 'Неправильный логин'})
    }

    if (!values.password) {
        Object.assign(errors, {password: 'Введите пароль'})
    } else if (!RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$').test(values.password)) {
        Object.assign(errors, {password: 'Введите правильный пароль'})
    }

    return errors
}