import React, { useState, useMemo, useCallback } from 'react';
import { Button, DialogContent, DialogActions, Stepper, Step as MuiStep, StepLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Dialog from './Dialog';
import { useDispatch } from 'react-redux';
import ColumnMapping from './ColumnMapping';
import UploadCsvFile from './UploadCsvFile';
import { toggleOpenDialog } from '../store/slices/accountStatementImportSlice';

const StyledDialogContent = styled(DialogContent)(() => ({
  display: 'flex',
  flexDirection: 'column'
}));

const StyledStepper = styled(Stepper)(() => ({
  marginBottom: 25
}));

const BackButton = styled(Button)(({ theme }) => ({
  '&:disabled': {
    backgroundColor: theme.palette.secondary.main
  }
}));

interface Step {
  label: string;
  component: React.ReactNode;
  onNext: () => void;
}

export default function AccountStatementImportDialog(): React.ReactNode {
  const dispatch = useDispatch();

  const { openDialog } = useSelector((state: RootState) => state.accountStatementImport);
  const [activeStep, setActiveStep] = useState(0);

  const steps: Step[] = useMemo(
    () => [
      {
        label: 'Dateiauswahl',
        component: <UploadCsvFile />,
        onNext: () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
      },
      {
        label: 'Spaltenzuordnung',
        component: <ColumnMapping />,
        onNext: () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
      },
      {
        label: 'Suchtextverwaltung',
        component: <div>Test</div>,
        onNext: () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
      }
    ],
    []
  );
  const isLastStep = useMemo(() => activeStep === steps.length, [activeStep, steps]);

  const onClose = useCallback(() => dispatch(toggleOpenDialog()), [dispatch]);
  const onBack = useCallback(() => setActiveStep((prevActiveStep) => prevActiveStep - 1), []);
  const onImport = useCallback(() => alert('IMPORTIEREN'), []);

  return (
    <Dialog open={openDialog} title="Kontoauszug importieren" onClose={onClose}>
      <StyledDialogContent>
        <StyledStepper activeStep={activeStep}>
          {steps.map((step) => (
            <MuiStep key={step.label}>
              <StepLabel sx={{ color: 'red !important' }}>{step.label}</StepLabel>
            </MuiStep>
          ))}
        </StyledStepper>
        {steps[activeStep]?.component}
      </StyledDialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <BackButton
          variant="contained"
          startIcon={<ArrowBackIcon />}
          color="secondary"
          disabled={activeStep === 0}
          onClick={onBack}
        >
          Zurück
        </BackButton>
        <Button
          variant="contained"
          startIcon={isLastStep ? <ImportExportIcon /> : <ArrowForwardIcon />}
          onClick={steps[activeStep]?.onNext ?? onImport}
        >
          {isLastStep ? 'Importieren' : 'Weiter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
