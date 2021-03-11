import {IValuesFormAuth} from "./IValuesFormAuth";
import {IErrorRegistration} from "./IErrorRegistration";
import React from "react";

export interface IFormRegistration {
    values: IValuesFormAuth,
    errors: IErrorRegistration,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
}