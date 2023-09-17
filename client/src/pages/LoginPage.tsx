import React, { useState } from 'react';
import { Box, Button, Card, CssBaseline, IconButton, InputAdornment, TextField } from '@mui/material';
import MorphedHeadline from '../components/MorphedHeadline';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const MAX_EMAIL_LENGTH = 320;
const MAX_PASSWORD_LENGTH = 128;

const StyledTextField = styled(TextField)(() => ({
  margin: 20,
  width: '95%'
}));

const StyledButton = styled(Button)(() => ({
  margin: '0px 20px 20px 20px',
  width: '25%'
}));

interface Errors {
  email: string;
  password: string;
}

export default function LoginPage(): React.ReactNode {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretMode, setSecretMode] = useState(true);
  const [errors, setErrors] = useState<Errors>({
    email: '',
    password: ''
  });

  const validateEmail = (email: string): string => {
    if (email === '') {
      return 'Die E-Mail-Adresse darf nicht leer sein.';
    }

    if (email.length > MAX_EMAIL_LENGTH) {
      return `Die E-Mail-Adresse darf maximal ${MAX_EMAIL_LENGTH} Zeichen enthalten.`;
    }

    return !EMAIL_REGEX.test(email) ? 'Die E-Mail-Adresse ist nicht gültig.' : '';
  };

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setErrors((state) => {
      return { ...state, email: validateEmail(event.target.value) };
    });
  };

  const validatePassword = (password: string): string => {
    if (password === '') {
      return 'Das Passwort darf nicht leer sein.';
    }

    return password.length > MAX_PASSWORD_LENGTH
      ? `Das Passwort darf maximal ${MAX_PASSWORD_LENGTH} Zeichen enthalten.`
      : '';
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setErrors((state) => {
      return { ...state, password: validatePassword(event.target.value) };
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <MorphedHeadline />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card sx={{ width: '50%' }}>
            <StyledTextField
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
            <StyledButton variant="text" sx={{ float: 'left' }}>
              Konto erstellen
            </StyledButton>
            <StyledButton variant="contained" sx={{ float: 'right' }}>
              Login
            </StyledButton>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
