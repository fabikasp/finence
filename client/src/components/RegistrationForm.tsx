import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { validateEmail, validatePassword, validateRepeatedPassword } from '../utils/validators';
import { LOGIN_ROUTE } from '../utils/const';
import { RootState } from '../store/store';
import { register } from '../store/actions';
import { setEmail, setErrors, setPassword, setRepeatedPassword } from '../store/slices/registrationSlice';

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

export default function RegistrationForm(): React.ReactNode {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [secretPasswordMode, setSecretPasswordMode] = useState(true);
  const [secretRepeatedPasswordMode, setSecretRepeatedPasswordMode] = useState(true);
  const { email, password, repeatedPassword, errors } = useSelector((state: RootState) => state.registration);
  const { email: loginEmail, password: loginPassword } = useSelector((state: RootState) => state.login);

  useEffect(() => {
    dispatch(setEmail(loginEmail));
    dispatch(setPassword(loginPassword));
    dispatch(setErrors({ email: '', password: '', repeatedPassword: '' }));
  }, []);

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(event.target.value));
    dispatch(setErrors({ ...errors, email: validateEmail(event.target.value) }));
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(event.target.value));
    dispatch(setErrors({ ...errors, password: validatePassword(event.target.value) }));
  };

  const onRepeatedPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRepeatedPassword(event.target.value));
    dispatch(setErrors({ ...errors, repeatedPassword: validateRepeatedPassword(event.target.value, password) }));
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
        type={secretPasswordMode ? 'password' : 'text'}
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
              <IconButton onClick={() => setSecretPasswordMode((state) => !state)}>
                {secretPasswordMode ? <VisibilityOffIcon color="secondary" /> : <VisibilityIcon color="secondary" />}
              </IconButton>
            </InputAdornment>
          )
        }}
        error={errors.password !== ''}
        helperText={errors.password}
      />
      <StyledTextField
        fullWidth
        type={secretRepeatedPasswordMode ? 'password' : 'text'}
        label="Passwort wiederholen"
        value={repeatedPassword}
        onChange={onRepeatedPasswordChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <KeyIcon color="secondary" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setSecretRepeatedPasswordMode((state) => !state)}>
                {secretRepeatedPasswordMode ? (
                  <VisibilityOffIcon color="secondary" />
                ) : (
                  <VisibilityIcon color="secondary" />
                )}
              </IconButton>
            </InputAdornment>
          )
        }}
        error={errors.repeatedPassword !== ''}
        helperText={errors.repeatedPassword}
      />
      <StyledButton variant="text" onClick={() => navigate(`/${LOGIN_ROUTE}`)} sx={{ float: 'left' }}>
        Login
      </StyledButton>
      <StyledButton variant="contained" onClick={() => dispatch(register({ email, password }))} sx={{ float: 'right' }}>
        Registrieren
      </StyledButton>
    </>
  );
}
