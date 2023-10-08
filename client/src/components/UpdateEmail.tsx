import React, { useEffect } from 'react';
import { Box, Button, InputAdornment, TextField } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { setEmail, setErrors } from '../store/slices/settingsSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { validateEmail } from '../utils/validators';
import { updateEmail } from '../store/actions';
import { USER_EMAIL_KEY } from '../utils/const';

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
  '&:disabled': {
    backgroundColor: '#89ABE3'
  },
  [theme.breakpoints.up('md')]: {
    width: '25%'
  },
  [theme.breakpoints.up('lg')]: {
    width: '20%'
  }
}));

export default function UpdateEmail(): React.ReactNode {
  const dispatch = useDispatch();

  const { email, errors } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    dispatch(setEmail(localStorage.getItem(USER_EMAIL_KEY) ?? ''));
  }, []);

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(event.target.value));
    dispatch(setErrors({ ...errors, email: validateEmail(event.target.value) }));
  };

  return (
    <Box display="flex" flexDirection="column">
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
      <StyledButton
        disabled={localStorage.getItem(USER_EMAIL_KEY) === email}
        variant="contained"
        startIcon={<EditIcon />}
        onClick={() => dispatch(updateEmail())}
      >
        Ändern
      </StyledButton>
    </Box>
  );
}
