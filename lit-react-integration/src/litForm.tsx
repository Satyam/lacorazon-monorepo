import * as React from 'react';
import { createComponent, EventName } from '@lit/react';
import {
  FormWrapper as LitFormWrapper,
  FORM_SUBMIT_EVENT,
  FormSubmitEvent,
  FORM_CHANGED_EVENT,
  FormChangedEvent,
  BooleanField as LitBooleanField,
  CurrencyField as LitCurrencyField,
  DateField as LitDateField,
  EmailField as LitEmailField,
  NumberField as LitNumberField,
  SelectField as LitSelectField,
  TextField as LitTextField,
  INPUT_CHANGED_EVENT,
  InputChangedEvent,
} from '@lacorazon/lit-form';

export { FormChangedEvent, FormSubmitEvent, InputChangedEvent };

export const FormWrapper = createComponent({
  react: React,
  tagName: 'form-wrapper',
  elementClass: LitFormWrapper,
  events: {
    onFormSubmit: FORM_SUBMIT_EVENT as EventName<FormSubmitEvent>,
    onFormChanged: FORM_CHANGED_EVENT as EventName<FormChangedEvent>,
  },
});

export const BooleanField = createComponent({
  react: React,
  tagName: 'boolean-field',
  elementClass: LitBooleanField,
  events: {
    onInputChanged: INPUT_CHANGED_EVENT as EventName<InputChangedEvent>,
  },
});

export const CurrencyField = createComponent({
  react: React,
  tagName: 'currency-field',
  elementClass: LitCurrencyField,
  events: {
    onInputChanged: INPUT_CHANGED_EVENT as EventName<InputChangedEvent>,
  },
});

export const DateField = createComponent({
  react: React,
  tagName: 'date-field',
  elementClass: LitDateField,
  events: {
    onInputChanged: INPUT_CHANGED_EVENT as EventName<InputChangedEvent>,
  },
});

export const EmailField = createComponent({
  react: React,
  tagName: 'email-field',
  elementClass: LitEmailField,
  events: {
    onInputChanged: INPUT_CHANGED_EVENT as EventName<InputChangedEvent>,
  },
});

export const NumberField = createComponent({
  react: React,
  tagName: 'number-field',
  elementClass: LitNumberField,
  events: {
    onInputChanged: INPUT_CHANGED_EVENT as EventName<InputChangedEvent>,
  },
});

export const SelectField = createComponent({
  react: React,
  tagName: 'select-field',
  elementClass: LitSelectField,
  events: {
    onInputChanged: INPUT_CHANGED_EVENT as EventName<InputChangedEvent>,
  },
});

export const TextField = createComponent({
  react: React,
  tagName: 'text-field',
  elementClass: LitTextField,
  events: {
    onInputChanged: INPUT_CHANGED_EVENT as EventName<InputChangedEvent>,
  },
});
