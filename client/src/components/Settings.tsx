import React, { useState, useEffect } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux';
import { clear } from '../store/slices/settingsSlice';
import UpdateEmail from './UpdateEmail';
import UpdatePassword from './UpdatePassword';
import DeleteAccount from './DeleteAccount';
import ManageCategories from './ManageCategories';

const CHANGE_EMAIL_PANEL = 'email';
const CHANGE_PASSWORD_PANEL = 'password';
const DELETE_ACCOUNT_PANEL = 'account';
const MANAGE_CATEGORIES_PANEL = 'categories';

export default function Settings(): React.ReactNode {
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState('');

  useEffect(
    () => () => {
      dispatch(clear());
    },
    []
  );

  const onAccordionClick = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : '');
  };

  return (
    <>
      <Accordion
        expanded={expanded === MANAGE_CATEGORIES_PANEL}
        onChange={onAccordionClick(MANAGE_CATEGORIES_PANEL)}
        sx={{ borderBottom: '1px solid #101820' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
          <Typography>Kategorien verwalten</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ManageCategories />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === CHANGE_EMAIL_PANEL}
        onChange={onAccordionClick(CHANGE_EMAIL_PANEL)}
        sx={{ borderTop: '1px solid #101820', borderBottom: '1px solid #101820' }}
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
        sx={{ borderTop: '1px solid #101820' }}
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
