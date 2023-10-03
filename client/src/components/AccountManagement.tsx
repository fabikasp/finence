import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import { styled } from '@mui/material/styles';

const CHANGE_EMAIL_PANEL = 'email';
const CHANGE_PASSWORD_PANEL = 'password';
const DELETE_ACCOUNT_PANEL = 'account';

const StyledTextField = styled(TextField)(() => ({
  marginBottom: 20
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: 20,
  [theme.breakpoints.up('md')]: {
    width: '25%'
  },
  [theme.breakpoints.up('lg')]: {
    width: '25%'
  }
}));

export default function AccountManagement(): React.ReactNode {
  const [expanded, setExpanded] = useState<string>('');

  const onAccordionClick = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : '');
  };

  return (
    <div>
      <Accordion
        expanded={expanded === CHANGE_EMAIL_PANEL}
        onChange={onAccordionClick(CHANGE_EMAIL_PANEL)}
        sx={{ borderBottom: '1px solid #89ABE3' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
          <Typography>E-Mail-Adresse ändern</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <StyledTextField
            fullWidth
            label="E-Mail-Adresse"
            value={''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon color="secondary" />
                </InputAdornment>
              )
            }}
            error={false}
            helperText={''}
          />
          <StyledButton
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => alert('WIP')}
            sx={{ float: 'left' }}
          >
            Ändern
          </StyledButton>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === CHANGE_PASSWORD_PANEL}
        onChange={onAccordionClick(CHANGE_PASSWORD_PANEL)}
        sx={{ borderTop: '1px solid #89ABE3', borderBottom: '1px solid #89ABE3' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
          <Typography>Passwort ändern</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <StyledTextField
            fullWidth
            type={'password'}
            label="Passwort"
            value={''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon color="secondary" />
                </InputAdornment>
              )
              /*endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSecretPasswordMode((state) => !state)}>
                    {secretPasswordMode ? (
                      <VisibilityOffIcon color="secondary" />
                    ) : (
                      <VisibilityIcon color="secondary" />
                    )}
                  </IconButton>
                </InputAdornment>
              )*/
            }}
            error={false}
            helperText={''}
          />
          <StyledTextField
            fullWidth
            type={'password'}
            label="Passwort wiederholen"
            value={''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon color="secondary" />
                </InputAdornment>
              )
              /*endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSecretRepeatedPasswordMode((state) => !state)}>
                    {secretRepeatedPasswordMode ? (
                      <VisibilityOffIcon color="secondary" />
                    ) : (
                      <VisibilityIcon color="secondary" />
                    )}
                  </IconButton>
                </InputAdornment>
              )*/
            }}
            error={false}
            helperText={''}
          />
          <StyledButton
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => alert('WIP')}
            sx={{ float: 'left' }}
          >
            Ändern
          </StyledButton>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === DELETE_ACCOUNT_PANEL}
        onChange={onAccordionClick(DELETE_ACCOUNT_PANEL)}
        sx={{ borderTop: '1px solid #89ABE3' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
          <Typography>Konto löschen</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus, varius pulvinar diam eros in elit.
            Pellentesque convallis laoreet laoreet.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
