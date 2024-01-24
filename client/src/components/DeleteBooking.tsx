import React, { useCallback } from 'react';
import { Button, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDispatch } from 'react-redux';
import { deleteBooking } from '../store/actions';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Dialog from './Dialog';
import { setDeletedBooking } from '../store/slices/financesSlice';

export default function DeleteBooking(): React.ReactNode {
  const dispatch = useDispatch();
  const { deletedBooking } = useSelector((state: RootState) => state.finances);

  const onClose = useCallback(() => dispatch(setDeletedBooking(undefined)), [dispatch]);
  const onDelete = useCallback(() => dispatch(deleteBooking()), [dispatch]);

  return (
    <Dialog open={!!deletedBooking} title="Buchung löschen" onClose={onClose}>
      <DialogContent>
        <DialogContentText>
          Willst du die {deletedBooking?.isIncome ? ' Einnahme' : ' Ausgabe'} wirklich löschen?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" startIcon={<DeleteForeverIcon />} onClick={onDelete}>
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
