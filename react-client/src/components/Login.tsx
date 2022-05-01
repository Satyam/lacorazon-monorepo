import { useNavigate } from 'react-router-dom';
import Page from 'components/Page';

import '@lacorazon/lit-form';
import { FormSubmit } from '@lacorazon/lit-form';
import { useAuth } from 'providers/Auth';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const submit = (ev: FormSubmit) => {
    const data = ev.values;
    if (data) {
      login(data).then(() => {
        navigate('/', { replace: true });
      });
    }
  };
  return (
    <Page title="Login" heading="Login">
      <form-wrapper novalidate onformSubmit={submit}>
        <email-field
          label="Email"
          name="email"
          placeholder="e-Mail"
          errorFeedback="Debe indicar una dirección de correo válida y que coincida con la registrada"
          required
        ></email-field>
        <text-field
          label="Contraseña"
          name="password"
          placeholder="Contraseña"
          required
          password
          errorFeedback="Debe indicar una contraseña"
        ></text-field>
        <button type="submit" className="btn btn-primary" disabled>
          Acceder
        </button>
      </form-wrapper>
    </Page>
  );
};

export default Login;
