import { h } from 'preact';
import { route } from 'preact-router';
import Page from 'components/Page';

import {
  FormWrapper,
  FormSubmitEvent,
  TextField,
  EmailField,
} from '@lacorazon/lit-react-integration';
import { useAuth } from 'providers/Auth';

export const Login = () => {
  const { login } = useAuth();
  const submit = (ev: FormSubmitEvent) => {
    const data = ev.wrapper.values;
    if (data) {
      login(data).then(() => {
        route('/', true);
      });
    }
  };
  return (
    <Page title="Login" heading="Login">
      <FormWrapper onFormSubmit={submit}>
        <form>
          <EmailField
            label="Email"
            name="email"
            placeholder="e-Mail"
            errorFeedback="Debe indicar una dirección de correo válida y que coincida con la registrada"
            required
          />
          <TextField
            label="Contraseña"
            name="password"
            placeholder="Contraseña"
            required
            password
            errorFeedback="Debe indicar una contraseña"
          />
          <button type="submit" class="btn btn-primary">
            Acceder
          </button>
        </form>
      </FormWrapper>
    </Page>
  );
};

export default Login;
