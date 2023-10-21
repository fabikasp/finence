import React, { useState, useEffect, useCallback } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux';
import { clear } from '../store/slices/settingsSlice';
import UpdateEmail from './UpdateEmail';
import UpdatePassword from './UpdatePassword';
import DeleteAccount from './DeleteAccount';

const CHANGE_EMAIL_PANEL = 'email';
const CHANGE_PASSWORD_PANEL = 'password';
const DELETE_ACCOUNT_PANEL = 'account';

export default function Settings(): React.ReactNode {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState('');

  useEffect(
    () => () => {
      dispatch(clear());
    },
    [dispatch]
  );

  const onAccordionClick = useCallback(
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : '');
    },
    []
  );

  return (
    <>
      <Accordion
        expanded={expanded === CHANGE_EMAIL_PANEL}
        onChange={onAccordionClick(CHANGE_EMAIL_PANEL)}
        sx={{ borderBottom: '1px solid #101820', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
          <Typography>E-Mail-Adresse ändern</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <UpdateEmail />
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
          <UpdatePassword />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === DELETE_ACCOUNT_PANEL}
        onChange={onAccordionClick(DELETE_ACCOUNT_PANEL)}
        sx={{ borderTop: '1px solid #101820', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
          <Typography>Konto löschen</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DeleteAccount />
        </AccordionDetails>
      </Accordion>
    </>
  );
}
