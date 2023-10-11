import React, { useState } from 'react';
import { Box, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { setErrors, setPassword, setRepeatedPassword } from '../store/slices/settingsSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { validatePassword, validateRepeatedPassword } from '../utils/validators';
import { updatePassword } from '../store/actions';

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: 20,
  [theme.breakpoints.up('md')]: {
    width: '70%'
  },
  [theme.breakpoints.up('lg')]: {
    width: '50%'
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: '25%'
  },
  [theme.breakpoints.up('lg')]: {
    width: '15%'
  }
}));

export default function UpdatePassword(): React.ReactNode {
  const dispatch = useDispatch();

  const [secretPasswordMode, setSecretPasswordMode] = useState(true);
  const [secretRepeatedPasswordMode, setSecretRepeatedPasswordMode] = useState(true);

  const { password, repeatedPassword, errors } = useSelector((state: RootState) => state.settings);

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(event.target.value));
    dispatch(setErrors({ ...errors, password: validatePassword(event.target.value), repeatedPassword: '' }));
  };

  const onRepeatedPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRepeatedPassword(event.target.value));
    dispatch(setErrors({ ...errors, repeatedPassword: validateRepeatedPassword(event.target.value, password) }));
  };

  return (
    <Box display="flex" flexDirection="column">
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
      <StyledButton variant="contained" startIcon={<EditIcon />} onClick={() => dispatch(updatePassword())}>
        Ändern
      </StyledButton>
    </Box>
  );
}
