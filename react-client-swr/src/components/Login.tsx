import { useNavigate } from 'react-router-dom';
import Page from 'components/Page';

import {
  FormWrapper,
  TextField,
  EmailField,
  FormSubmitEvent,
} from '@lacorazon/lit-react-integration';
import { useAuth } from 'providers/Auth';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = (ev: FormSubmitEvent) => {
    const data = ev.values;
    if (data) {
      login(data).then(() => {
        navigate('/', { replace: true });
      });
    }
  };

  return (
    <Page title="Login" heading="Login">
      <FormWrapper novalidate onFormSubmit={submit}>
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
        <button type="submit" className="btn btn-primary" disabled>
          Acceder
        </button>
      </FormWrapper>
    </Page>
  );
};

export default Login;
