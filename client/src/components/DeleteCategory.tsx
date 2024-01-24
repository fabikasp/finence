import React, { useCallback } from 'react';
import { Button, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDispatch } from 'react-redux';
import { deleteCategory } from '../store/actions';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setDeletedCategory } from '../store/slices/categoriesSlice';
import Dialog from './Dialog';

export default function DeleteCategory(): React.ReactNode {
  const dispatch = useDispatch();
  const { deletedCategory } = useSelector((state: RootState) => state.categories);

  const onClose = useCallback(() => dispatch(setDeletedCategory(undefined)), [dispatch]);
  const onDelete = useCallback(() => dispatch(deleteCategory()), [dispatch]);

  return (
    <Dialog open={!!deletedCategory} title="Kategorie löschen" onClose={onClose}>
      <DialogContent>
        <DialogContentText>
          Durch die Löschung dieser Kategorie werden ebenfalls alle damit verknüpften
          {deletedCategory?.forIncome ? ' Einnahmen' : ' Ausgaben'} gelöscht. Willst du die Kategorie wirklich löschen?
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
