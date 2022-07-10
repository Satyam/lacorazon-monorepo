import * as React from 'react';
import { createComponent, EventName } from '@lit-labs/react';
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

export const FormWrapper = createComponent(
  React,
  'form-wrapper',
  LitFormWrapper,
  {
    onFormSubmit: FORM_SUBMIT_EVENT as EventName<FormSubmitEvent>,
    onFormChanged: FORM_CHANGED_EVENT as EventName<FormChangedEvent>,
  }
);

export const BooleanField = createComponent(
  React,
  'boolean-field',
  LitBooleanField,
  {
    onInputChanged: INPUT_CHANGED_EVENT as EventName<
      InputChangedEvent<boolean>
    >,
  }
);

export const CurrencyField = createComponent(
  React,
  'currency-field',
  LitCurrencyField,
  {
    onInputChanged: INPUT_CHANGED_EVENT as EventName<InputChangedEvent<number>>,
  }
);

export const DateField = createComponent(React, 'date-field', LitDateField, {
  onInputChanged: INPUT_CHANGED_EVENT as EventName<InputChangedEvent<Date>>,
});

export const EmailField = createComponent(React, 'email-field', LitEmailField, {
  onInputChanged: INPUT_CHANGED_EVENT as EventName<InputChangedEvent<string>>,
});

export const NumberField = createComponent(
  React,
  'number-field',
  LitNumberField,
  {
    onInputChanged: INPUT_CHANGED_EVENT as EventName<InputChangedEvent<number>>,
  }
);

export const SelectField = createComponent(
  React,
  'select-field',
  LitSelectField,
  {
    onInputChanged: INPUT_CHANGED_EVENT as EventName<InputChangedEvent<string>>,
  }
);

export const TextField = createComponent(React, 'text-field', LitTextField, {
  onInputChanged: INPUT_CHANGED_EVENT as EventName<InputChangedEvent<string>>,
});
