import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Backdrop, Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { validateEmail, validatePassword } from '../utils/validators';
import { DASHBOARD_ROUTE, REGISTRATION_ROUTE } from '../utils/const';
import { useLazyLoginQuery } from '../queries/userQueries';

const USER_NOT_FOUND_ERROR = 'Das Finence-Konto wurde nicht gefunden.';

const StyledTextField = styled(TextField)(() => ({
  marginBottom: 20
}));

const StyledButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: '25%'
  },
  [theme.breakpoints.up('lg')]: {
    width: '25%'
  }
}));

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1
}));

export default function LoginForm(): React.ReactNode {
  const navigate = useNavigate();
  const [trigger, { isError, isFetching, isSuccess }] = useLazyLoginQuery();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretMode, setSecretMode] = useState(true);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (isError) {
      setErrors({ email: USER_NOT_FOUND_ERROR, password: USER_NOT_FOUND_ERROR });
    }
  }, [isError]);

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setErrors({ ...errors, email: validateEmail(event.target.value) });
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setErrors({ ...errors, password: validatePassword(event.target.value) });
  };

  const onLogin = () => {
    setErrors({ email: '', password: '' });

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });

      return;
    }

    trigger({ email, password });
  };

  if (isSuccess) {
    return <Navigate to={`/${DASHBOARD_ROUTE}`} replace />;
  }

  return (
    <>
      <StyledTextField
        fullWidth
        label="E-Mail-Adresse"
        value={email}
        onChange={onEmailChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircleIcon color="secondary" />
            </InputAdornment>
          )
        }}
        error={errors.email !== ''}
        helperText={errors.email}
      />
      <StyledTextField
        fullWidth
        type={secretMode ? 'password' : 'text'}
        label="Passwort"
        value={password}
        onChange={onPasswordChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <KeyIcon color="secondary" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setSecretMode((state) => !state)}>
                {secretMode ? <VisibilityOffIcon color="secondary" /> : <VisibilityIcon color="secondary" />}
              </IconButton>
            </InputAdornment>
          )
        }}
        error={errors.password !== ''}
        helperText={errors.password}
      />
      <StyledButton variant="text" onClick={() => navigate(`/${REGISTRATION_ROUTE}`)} sx={{ float: 'left' }}>
        Registrieren
      </StyledButton>
      <StyledButton variant="contained" onClick={onLogin} sx={{ float: 'right' }}>
        Login
      </StyledButton>
      <StyledBackdrop open={isFetching}>
        <CircularProgress color="primary" />
      </StyledBackdrop>
    </>
  );
}
