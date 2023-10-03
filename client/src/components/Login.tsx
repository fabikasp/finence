import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { REGISTRATION_ROUTE } from '../utils/const';
import { RootState } from '../store/store';
import { setEmail, setErrors, setPassword } from '../store/slices/loginSlice';
import { login } from '../store/actions';
import { validateEmail, validatePassword } from '../utils/validators';

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

export default function Login(): React.ReactNode {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [secretMode, setSecretMode] = useState(true);
  const { email, password, errors } = useSelector((state: RootState) => state.login);
  const { email: registrationEmail, password: registrationPassword } = useSelector(
    (state: RootState) => state.registration
  );

  useEffect(() => {
    dispatch(setEmail(registrationEmail));
    dispatch(setPassword(registrationPassword));
    dispatch(setErrors({ email: '', password: '' }));
  }, []);

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(event.target.value));
    dispatch(setErrors({ ...errors, email: validateEmail(event.target.value, true) }));
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(event.target.value));
    dispatch(setErrors({ ...errors, password: validatePassword(event.target.value, true) }));
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
      <StyledButton variant="contained" onClick={() => dispatch(login({ email, password }))} sx={{ float: 'right' }}>
        Login
      </StyledButton>
    </>
  );
}
