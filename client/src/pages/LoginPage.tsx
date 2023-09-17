import React, { useState } from 'react';
import { Box, Button, Card, CssBaseline, IconButton, InputAdornment, TextField } from '@mui/material';
import MorphedHeadline from '../components/MorphedHeadline';
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { validateEmail, validatePassword } from '../utils/validators';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: 20,
  [theme.breakpoints.up('md')]: {
    width: '75%'
  },
  [theme.breakpoints.up('lg')]: {
    width: '50%'
  }
}));

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

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setErrors((state) => ({ ...state, email: validateEmail(event.target.value) }));
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setErrors((state) => ({ ...state, password: validatePassword(event.target.value) }));
  };

  const onLogin = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });

      return;
    }

    alert('WIP');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <MorphedHeadline />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <StyledCard>
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
            <StyledButton variant="text" sx={{ float: 'left' }}>
              Registrieren
            </StyledButton>
            <StyledButton variant="contained" onClick={onLogin} sx={{ float: 'right' }}>
              Login
            </StyledButton>
          </StyledCard>
        </Box>
      </Box>
    </Box>
  );
}
