import React from 'react';
import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { setConfirmation, setErrors } from '../store/slices/settingsSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { validateConfirmation } from '../utils/validators';
import { deleteAccount } from '../store/actions';
import { CONFIRMATION_TEXT } from '../utils/const';

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
    backgroundColor: theme.palette.error.main
  },
  [theme.breakpoints.up('md')]: {
    width: '25%'
  },
  [theme.breakpoints.up('lg')]: {
    width: '15%'
  }
}));

export default function DeleteAccount(): React.ReactNode {
  const dispatch = useDispatch();

  const { confirmation, errors } = useSelector((state: RootState) => state.settings);

  const onConfirmationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setConfirmation(event.target.value));
    dispatch(setErrors({ ...errors, confirmation: validateConfirmation(event.target.value) }));
  };

  return (
    <Box display="flex" flexDirection="column">
      <Typography sx={{ marginBottom: 3 }}>
        Bitte bestätigen Sie die Kontolöschung mit dem Wort <strong>{`„${CONFIRMATION_TEXT}“`}</strong>.
      </Typography>
      <StyledTextField
        fullWidth
        label="Bestätigung der Kontolöschung"
        value={confirmation}
        onChange={onConfirmationChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {errors.confirmation === '' && confirmation !== '' ? (
                <LockOpenIcon color="secondary" />
              ) : (
                <LockIcon color="secondary" />
              )}
            </InputAdornment>
          )
        }}
        error={errors.confirmation !== ''}
        helperText={errors.confirmation}
      />
      <StyledButton
        disabled={confirmation !== CONFIRMATION_TEXT}
        variant="contained"
        color="error"
        startIcon={<DeleteForeverIcon />}
        onClick={() => dispatch(deleteAccount())}
      >
        Konto löschen
      </StyledButton>
    </Box>
  );
}
