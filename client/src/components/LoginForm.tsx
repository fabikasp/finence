import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { validateEmail, validatePassword } from '../utils/validators';
import { REGISTRATION_ROUTE } from '../utils/const';
import { RootState } from '../store/store';
import { setErrors } from '../store/slices/loginSlice';
import { login } from '../store/actions';

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
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretMode, setSecretMode] = useState(true);

  const { errors, showProgressIndicator } = useSelector((state: RootState) => state.login);

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    dispatch(setErrors({ ...errors, email: validateEmail(event.target.value) }));
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    dispatch(setErrors({ ...errors, password: validatePassword(event.target.value) }));
  };

  const onLogin = () => {
    dispatch(setErrors({ email: '', password: '' }));

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      dispatch(setErrors({ email: emailError, password: passwordError }));

      return;
    }

    dispatch(login({ email, password }));
  };

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
      <StyledBackdrop open={showProgressIndicator}>
        <CircularProgress color="primary" />
      </StyledBackdrop>
    </>
  );
}
