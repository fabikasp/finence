import React, { useState, useEffect, useCallback } from 'react';
import IntervalSelection from './IntervalSelection';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import PieChart from './PieChart';
import { useDispatch } from 'react-redux';
import { loadBookings } from '../store/actions';
import { clear, toggleShowIncomes } from '../store/slices/dashboardSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Balance from './Balance';

enum Panel {
  BALANCE_TABLE,
  PIE_CHART
}

const StyledBox = styled(Box)(() => ({
  marginTop: 20
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
  '&.Mui-selected, &.Mui-selected:hover': {
    backgroundColor: theme.palette.primary.main,
    color: '#000000'
  },
  height: 25,
  marginLeft: 15
}));

export default function Dashboard(): React.ReactNode {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadBookings());

    return () => {
      clear();
    };
  }, [dispatch]);

  const [expanded, setExpanded] = useState<Panel | undefined>(Panel.BALANCE_TABLE);
  const { showIncomes } = useSelector((state: RootState) => state.dashboard);

  const onAccordionClick = useCallback(
    (panel: Panel) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : undefined);
    },
    []
  );

  const onToggleButtonClick = useCallback(
    (event: React.SyntheticEvent) => {
      event.stopPropagation();
      dispatch(toggleShowIncomes());
    },
    [dispatch]
  );

  return (
    <>
      <IntervalSelection />
      <StyledBox>
        <Accordion
          expanded={expanded === Panel.BALANCE_TABLE}
          onChange={onAccordionClick(Panel.BALANCE_TABLE)}
          sx={{ borderBottom: '1px solid #101820', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
            <Typography>Bilanz</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Balance />
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === Panel.PIE_CHART}
          onChange={onAccordionClick(Panel.PIE_CHART)}
          sx={{ borderTop: '1px solid #101820', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
            <Typography>Buchungsstatistik</Typography>
            {expanded === Panel.PIE_CHART && (
              <ToggleButtonGroup color="primary" value={showIncomes}>
                <StyledToggleButton value={true} onClick={onToggleButtonClick}>
                  Einnahmen
                </StyledToggleButton>
                <StyledToggleButton value={false} onClick={onToggleButtonClick}>
                  Ausgaben
                </StyledToggleButton>
              </ToggleButtonGroup>
            )}
          </AccordionSummary>
          <AccordionDetails>
            <PieChart />
          </AccordionDetails>
        </Accordion>
      </StyledBox>
    </>
  );
}
