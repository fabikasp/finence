import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { setErrors } from '../store/slices/accountManagementSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { validateConfirmation, validateEmail, validatePassword, validateRepeatedPassword } from '../utils/validators';
import { updateAccount } from '../store/actions';

const CHANGE_EMAIL_PANEL = 'email';
const CHANGE_PASSWORD_PANEL = 'password';
const DELETE_ACCOUNT_PANEL = 'account';

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
    width: '20%'
  }
}));

export default function AccountManagement(): React.ReactNode {
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [secretPasswordMode, setSecretPasswordMode] = useState(true);
  const [secretRepeatedPasswordMode, setSecretRepeatedPasswordMode] = useState(true);
  const [confirmation, setConfirmation] = useState('');

  const { errors } = useSelector((state: RootState) => state.accountManagement);

  const onAccordionClick = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : '');
  };

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    dispatch(setErrors({ ...errors, email: validateEmail(event.target.value) }));
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    dispatch(setErrors({ ...errors, password: validatePassword(event.target.value) }));
  };

  const onRepeatedPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatedPassword(event.target.value);
    dispatch(setErrors({ ...errors, repeatedPassword: validateRepeatedPassword(event.target.value, password) }));
  };

  const onConfirmationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmation(event.target.value);
    dispatch(setErrors({ ...errors, confirmation: validateConfirmation(event.target.value, 'Löschen') }));
  };

  const onUpdateEmailClick = () => {
    dispatch(setErrors({ ...errors, email: '' }));

    const emailError = validateEmail(email);
    if (emailError) {
      dispatch(setErrors({ ...errors, email: validateEmail(email) }));

      return;
    }

    dispatch(updateAccount({ email }));
  };

  return (
    <div>
      <Accordion
        expanded={expanded === CHANGE_EMAIL_PANEL}
        onChange={onAccordionClick(CHANGE_EMAIL_PANEL)}
        sx={{ borderBottom: '1px solid #101820' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
          <Typography>E-Mail-Adresse ändern</Typography>
        </AccordionSummary>
        <AccordionDetails>
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
            <StyledButton variant="contained" startIcon={<EditIcon />} onClick={onUpdateEmailClick}>
              Ändern
            </StyledButton>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === CHANGE_PASSWORD_PANEL}
        onChange={onAccordionClick(CHANGE_PASSWORD_PANEL)}
        sx={{ borderTop: '1px solid #101820', borderBottom: '1px solid #101820' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
          <Typography>Passwort ändern</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column">
            <StyledTextField
              fullWidth
              type={'password'}
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
                      {secretPasswordMode ? (
                        <VisibilityOffIcon color="secondary" />
                      ) : (
                        <VisibilityIcon color="secondary" />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={errors.password !== ''}
              helperText={errors.password}
            />
            <StyledTextField
              fullWidth
              type={'password'}
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
            <StyledButton variant="contained" startIcon={<EditIcon />} onClick={() => alert('WIP')}>
              Ändern
            </StyledButton>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === DELETE_ACCOUNT_PANEL}
        onChange={onAccordionClick(DELETE_ACCOUNT_PANEL)}
        sx={{ borderTop: '1px solid #101820' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
          <Typography>Konto löschen</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column">
            <Typography sx={{ marginBottom: 3 }}>
              Die Kontolöschung muss mit dem Wort <strong>„Löschen“</strong> bestätigt werden.
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
              variant="contained"
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={() => alert('WIP')}
            >
              Konto löschen
            </StyledButton>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
