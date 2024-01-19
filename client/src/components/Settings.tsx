import React, { useState, useEffect, useCallback } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux';
import { clear } from '../store/slices/settingsSlice';
import UpdateEmail from './UpdateEmail';
import UpdatePassword from './UpdatePassword';
import DeleteAccount from './DeleteAccount';

enum Panel {
  CHANGE_EMAIL,
  CHANGE_PASSWORD,
  DELETE_ACCOUNT
}

export default function Settings(): React.ReactNode {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState<Panel | undefined>(Panel.CHANGE_EMAIL);

  useEffect(
    () => () => {
      dispatch(clear());
    },
    [dispatch]
  );

  const onAccordionClick = useCallback(
    (panel: Panel) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : undefined);
    },
    []
  );

  return (
    <>
      <Accordion
        expanded={expanded === Panel.CHANGE_EMAIL}
        onChange={onAccordionClick(Panel.CHANGE_EMAIL)}
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
        expanded={expanded === Panel.CHANGE_PASSWORD}
        onChange={onAccordionClick(Panel.CHANGE_PASSWORD)}
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
        expanded={expanded === Panel.DELETE_ACCOUNT}
        onChange={onAccordionClick(Panel.DELETE_ACCOUNT)}
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
