import React, { useCallback, useEffect } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setColumnMapping } from '../store/slices/accountStatementImportSlice';

export default function ColumnMapping(): React.ReactNode {
  const dispatch = useDispatch();
  const { columnMapping } = useSelector((state: RootState) => state.accountStatementImport);

  useEffect(() => {
    // TODO: Mapping laden
  }, []);

  // TODO: Validate
  const onDateColumnLabelChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setColumnMapping({ ...columnMapping, dateColumnLabel: event.target.value }));
    },
    [dispatch, columnMapping]
  );

  // TODO: Validate
  const onAmountColumnLabelChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setColumnMapping({ ...columnMapping, amountColumnLabel: event.target.value }));
    },
    [dispatch, columnMapping]
  );

  // TODO: Wenn nichts geändert, kein Servercall
  // TODO: Saga für jeden Schritt mit Error Manipulation

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
      />
    </>
  );
}
