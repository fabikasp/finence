import React, { useCallback } from 'react';
import { Box, Button, FormHelperText, IconButton, Paper, Typography } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useDispatch } from 'react-redux';
import { setCsvFile, setErrors } from '../store/slices/accountStatementImportSlice';
import { validateCsvFileContent } from '../utils/validators';

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 180,
  border: `2px dashed ${theme.palette.secondary.main}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'inherit'
}));

export default function UploadCsvFile(): React.ReactNode {
  const dispatch = useDispatch();
  const { csvFile, errors } = useSelector((state: RootState) => state.accountStatementImport);

  const readCsvFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const error = validateCsvFileContent((event.target?.result ?? '') as string);
        dispatch(setErrors({ ...errors, csvFile: error }));

        if (error) {
          return;
        }

        if (event.target?.result) {
          dispatch(setCsvFile({ name: file.name, content: event.target.result as string }));
        }
      };
      reader.readAsText(file);
    },
    [errors, dispatch]
  );

  const onFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;

      if (fileList && fileList.length > 0) {
        readCsvFile(fileList[0]);
      }
    },
    [readCsvFile]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const fileList = event.dataTransfer.files;
      if (fileList && fileList.length > 0) {
        readCsvFile(fileList[0]);
      }
    },
    [readCsvFile]
  );

  const onCancel = useCallback(() => dispatch(setCsvFile(undefined)), [dispatch]);

  return (
    <>
      <StyledPaper
        onDragOver={(event) => event.preventDefault()}
        onDragEnter={(event) => event.preventDefault()}
        onDragLeave={(event) => event.preventDefault()}
        onDrop={onDrop}
      >
        {!csvFile && (
          <>
            <input id="fileInput" type="file" accept=".csv" onChange={onFileChange} style={{ display: 'none' }} />
            <label htmlFor="fileInput">
              <Button variant="contained" component="span" startIcon={<FileUploadIcon />}>
                Datei auswählen
              </Button>
            </label>
            <Typography variant="caption" sx={{ marginTop: 1 }}>
              Oder zieh die Datei hierher
            </Typography>
          </>
        )}
        {csvFile && (
          <Box display="flex" alignItems="center">
            <Typography>{csvFile.name}</Typography>
            <IconButton color="secondary" onClick={onCancel}>
              <CancelIcon />
            </IconButton>
          </Box>
        )}
      </StyledPaper>
      <FormHelperText error={!!errors?.csvFile}>{errors?.csvFile}</FormHelperText>
    </>
  );
}
