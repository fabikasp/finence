import React, { useCallback, useEffect } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setColumnMapping, setErrors } from '../store/slices/accountStatementImportSlice';
import { validateColumnLabel } from '../utils/validators';
import { assertNonNullable } from '../utils/assert';
import { loadColumnMapping } from '../store/actions';

export default function ColumnMapping(): React.ReactNode {
  const dispatch = useDispatch();
  const { csvFile, columnMapping, errors } = useSelector((state: RootState) => state.accountStatementImport);

  useEffect(() => {
    dispatch(loadColumnMapping());
  }, [dispatch]);

  const onDateColumnLabelChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        setColumnMapping({
          ...columnMapping,
          dateColumnLabel: event.target.value
        })
      );

      assertNonNullable(csvFile);
      dispatch(setErrors({ ...errors, dateColumnLabel: validateColumnLabel(event.target.value, csvFile.content) }));
    },
    [dispatch, columnMapping, csvFile, errors]
  );

  const onAmountColumnLabelChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        setColumnMapping({
          ...columnMapping,
          amountColumnLabel: event.target.value
        })
      );

      assertNonNullable(csvFile);
      dispatch(setErrors({ ...errors, amountColumnLabel: validateColumnLabel(event.target.value, csvFile.content) }));
    },
    [dispatch, columnMapping, csvFile, errors]
  );

  return (
    <>
      <TextField
        fullWidth
        label="Name der Datumsspalte"
        value={columnMapping.dateColumnLabel}
        onChange={onDateColumnLabelChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ViewColumnIcon color="secondary" />
            </InputAdornment>
          )
        }}
        error={!!errors?.dateColumnLabel}
        helperText={errors?.dateColumnLabel}
        sx={{ marginBottom: 3 }}
      />
      <TextField
        fullWidth
        label="Name der Betragsspalte"
        value={columnMapping.amountColumnLabel}
        onChange={onAmountColumnLabelChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ViewColumnIcon color="secondary" />
            </InputAdornment>
          )
        }}
        error={!!errors?.amountColumnLabel}
        helperText={errors?.amountColumnLabel}
      />
    </>
  );
}
