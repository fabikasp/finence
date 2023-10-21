import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDispatch } from 'react-redux';
import { deleteCategory } from '../store/actions';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setDeletedCategory } from '../store/slices/categoriesSlice';

const StyledIconButton = styled(IconButton)(() => ({
  position: 'absolute',
  right: 8,
  top: 8
}));

export default function DeleteCategory(): React.ReactNode {
  const dispatch = useDispatch();
  const { deletedCategory } = useSelector((state: RootState) => state.categories);

  const onClose = () => dispatch(setDeletedCategory(undefined));
  const onDelete = () => dispatch(deleteCategory());

  return (
    <Dialog fullWidth open={deletedCategory !== undefined} onClose={onClose}>
      <DialogTitle>Kategorie löschen</DialogTitle>
      <StyledIconButton onClick={onClose}>
        <CloseIcon color="secondary" />
      </StyledIconButton>
      <DialogContent>
        <DialogContentText>
          Durch die Löschung dieser Kategorie werden alle damit verknüpften Einnahmen und Ausgaben ebenfalls gelöscht.
          Wollen Sie die Kategorie wirklich löschen?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" color="error" startIcon={<DeleteForeverIcon />} onClick={onDelete}>
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
