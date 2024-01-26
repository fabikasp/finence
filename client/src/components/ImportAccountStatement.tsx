import React, { useMemo, useCallback } from 'react';
import { Button, DialogContent, DialogActions, Stepper, Step as MuiStep, StepLabel, Typography } from '@mui/material';
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
import { setCurrentStep, setErrors, toggleOpenDialog } from '../store/slices/accountStatementImportSlice';
import { validateCsvFileContent } from '../utils/validators';
import { importAccountStatement, persistColumnMapping } from '../store/actions';

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

export default function ImportAccountStatement(): React.ReactNode {
  const dispatch = useDispatch();

  const { openDialog, currentStep, csvFile, errors } = useSelector((state: RootState) => state.accountStatementImport);

  const onClose = useCallback(() => dispatch(toggleOpenDialog()), [dispatch]);
  const onBack = useCallback(() => dispatch(setCurrentStep(currentStep - 1)), [currentStep, dispatch]);
  const onNextAfterColumnMapping = useCallback(() => dispatch(persistColumnMapping()), [dispatch]);
  const onImport = useCallback(() => dispatch(importAccountStatement()), [dispatch]);

  const onNextAfterUpload = useCallback(() => {
    const error = validateCsvFileContent(csvFile?.content ?? '');
    dispatch(setErrors({ ...errors, csvFile: error }));

    if (error) {
      return;
    }

    dispatch(setCurrentStep(currentStep + 1));
  }, [csvFile, errors, currentStep, dispatch]);

  const steps: Step[] = useMemo(
    () => [
      {
        label: 'Dateiauswahl',
        component: <UploadCsvFile />,
        onNext: onNextAfterUpload
      },
      {
        label: 'Spaltenzuordnung',
        component: <ColumnMapping />,
        onNext: onNextAfterColumnMapping
      },
      {
        label: 'Import',
        component: (
          <Typography>
            Bitte stell sicher, dass du genügend Stichwörter für deine Kategorien angelegt hast. Wenn eine Buchung auf
            kein Stichwort zutrifft, wird der Buchung keine Kategorie zugeordnet.
          </Typography>
        ),
        onNext: onImport
      }
    ],
    [onNextAfterUpload, onNextAfterColumnMapping, onImport]
  );
  const isLastStep = useMemo(() => currentStep >= steps.length - 1, [currentStep, steps]);

  return (
    <Dialog open={openDialog} title="Kontoauszug importieren" onClose={onClose}>
      <StyledDialogContent>
        <StyledStepper activeStep={currentStep}>
          {steps.map((step) => (
            <MuiStep key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </MuiStep>
          ))}
        </StyledStepper>
        {steps[currentStep]?.component ?? steps[steps.length - 1].component}
      </StyledDialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <BackButton
          variant="contained"
          startIcon={<ArrowBackIcon />}
          color="secondary"
          disabled={currentStep === 0}
          onClick={onBack}
        >
          Zurück
        </BackButton>
        <Button
          variant="contained"
          startIcon={isLastStep ? <ImportExportIcon /> : <ArrowForwardIcon />}
          onClick={steps[currentStep]?.onNext ?? steps[steps.length - 1].onNext}
        >
          {isLastStep ? 'Importieren' : 'Weiter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
