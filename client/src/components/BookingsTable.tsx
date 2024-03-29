import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  IconButton,
  Fab,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ReplayIcon from '@mui/icons-material/Replay';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import IntervalSelection from './IntervalSelection';
import {
  DisplayableBooking,
  Repetition,
  Tab,
  convertToUpdateableBooking,
  setBookingTablePage,
  setCreatedBooking,
  setDeletedBooking,
  setUpdatedBooking
} from '../store/slices/financesSlice';
import { RootState } from '../store/store';
import { loadBookings, loadCategories } from '../store/actions';
import CreateBooking from './CreateBooking';
import moment from 'moment';
import DeleteBooking from './DeleteBooking';
import { assertNonNullable } from '../utils/assert';
import { convertMomentToUnix, convertUnixToMoment, dateLiesInInterval } from '../utils/helper';
import UpdateBooking from './UpdateBooking';
import ImportAccountStatement from './ImportAccountStatement';
import { toggleOpenDialog } from '../store/slices/accountStatementImportSlice';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  if (b[orderBy] === a[orderBy]) {
    return 0;
  }

  return b[orderBy] < a[orderBy] ? -1 : 1;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof DisplayableBooking>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string | boolean }, b: { [key in Key]: number | string | boolean }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
  return array
    .map((element, index) => [element, index] as [T, number])
    .sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }

      return a[1] - b[1];
    })
    .map((element) => element[0]);
}

interface HeadCell {
  readonly id: keyof DisplayableBooking;
  readonly label: string;
  readonly numeric: boolean;
}

interface CustomTableHeadProps {
  readonly order: Order;
  readonly orderBy: string;
  readonly onRequestSort: (event: React.MouseEvent<unknown>, property: keyof DisplayableBooking) => void;
}

function CustomTableHead(props: CustomTableHeadProps): React.ReactNode {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof DisplayableBooking) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  const headCells: HeadCell[] = useMemo(
    () => [
      {
        id: 'isIncome',
        numeric: false,
        label: 'Typ'
      },
      {
        id: 'date',
        numeric: false,
        label: 'Datum'
      },
      {
        id: 'amount',
        numeric: true,
        label: 'Betrag'
      },
      {
        id: 'category',
        numeric: false,
        label: 'Kategorie'
      },
      {
        id: 'note',
        numeric: false,
        label: 'Bemerkung'
      }
    ],
    []
  );

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} sx={{ fontWeight: 'bold' }}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell />
      </TableRow>
    </TableHead>
  );
}

const StyledBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.text.primary}`,
  borderRadius: theme.shape.borderRadius
}));

const BookingTypeIconWrapper = styled(Box)(() => ({
  marginTop: 4
}));

const PopoverButtonWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column'
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  justifyContent: 'left'
}));

const StyledFab = styled(Fab)(() => ({
  marginRight: 15
}));

interface PopoverReference {
  readonly referencedBookingId: number;
  readonly anchorElement: HTMLButtonElement;
}

export default function BookingsTable(): React.ReactNode {
  const dispatch = useDispatch();

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof DisplayableBooking>('date');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [popoverReference, setPopoverReference] = useState<PopoverReference | undefined>(undefined);
  const { tab, bookingTablePage, bookings } = useSelector((state: RootState) => state.finances);
  const { customIntervalEnabled, nativeInterval, customInterval } = useSelector(
    (state: RootState) => state.intervalSelection
  );

  useEffect(() => {
    dispatch(loadCategories());
    dispatch(loadBookings());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setBookingTablePage(0));
  }, [dispatch, customIntervalEnabled, nativeInterval, customInterval]);

  const onRequestSort = useCallback(
    (_: React.MouseEvent<unknown>, property: keyof DisplayableBooking) => {
      const isAsc = orderBy === property && order === 'asc';

      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    },
    [order, orderBy]
  );

  const onOpenPopover = useCallback(
    (referencedBookingId: number, anchorElement: HTMLButtonElement) =>
      setPopoverReference({ referencedBookingId, anchorElement }),
    []
  );

  const onClosePopover = useCallback(() => setPopoverReference(undefined), []);

  const onChangePage = useCallback(
    (_: unknown, newPage: number) => {
      dispatch(setBookingTablePage(newPage));
    },
    [dispatch]
  );

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value));
      dispatch(setBookingTablePage(0));
    },
    [dispatch]
  );

  const labelDisplayedRows = useCallback(
    ({ from, to, count }: { from: number; to: number; count: number }) => `${from}–${to} von ${count}`,
    []
  );

  const filteredBookings = useMemo(
    () =>
      bookings
        .filter((booking) => (tab === Tab.INCOME ? booking.isIncome : tab === Tab.EXPENSES ? !booking.isIncome : true))
        .filter((booking) => dateLiesInInterval(booking.date, customIntervalEnabled, nativeInterval, customInterval)),
    [bookings, tab, customIntervalEnabled, nativeInterval, customInterval]
  );

  const visibleRows = useMemo(() => {
    const mappedBookings = filteredBookings.map((booking) => ({
      ...booking,
      category: booking.category ?? '',
      note: booking.note ?? '',
      date: convertUnixToMoment(booking.date).format('DD.MM.YYYY')
    }));

    return stableSort(mappedBookings, getComparator(order, orderBy)).slice(
      bookingTablePage * rowsPerPage,
      bookingTablePage * rowsPerPage + rowsPerPage
    );
  }, [filteredBookings, order, orderBy, bookingTablePage, rowsPerPage]);

  const onCreateClick = useCallback(
    () =>
      dispatch(
        setCreatedBooking({
          isIncome: [Tab.TOTAL, Tab.INCOME].includes(tab),
          date: convertMomentToUnix(moment()),
          amount: '',
          repetition: Repetition.ONCE
        })
      ),
    [tab, dispatch]
  );

  const onImportClick = useCallback(() => dispatch(toggleOpenDialog()), [dispatch]);

  const onUpdateClick = useCallback(
    (bookingId: number) => () => {
      const booking = bookings.find((booking) => booking.id === bookingId);
      assertNonNullable(booking);

      dispatch(setUpdatedBooking(convertToUpdateableBooking(booking)));
      setPopoverReference(undefined);
    },
    [bookings, dispatch]
  );

  const onDeleteClick = useCallback(
    (bookingId: number) => () => {
      dispatch(setDeletedBooking(bookings.find((booking) => booking.id === bookingId)));
      setPopoverReference(undefined);
    },
    [bookings, dispatch]
  );

  return (
    <>
      <StyledBox>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <IntervalSelection useMargin />
          <Box>
            <StyledFab color="primary" size="small" onClick={onCreateClick}>
              <AddIcon />
            </StyledFab>
            <StyledFab color="primary" size="small" onClick={onImportClick}>
              <ImportExportIcon />
            </StyledFab>
          </Box>
        </Box>
        <Table size="small">
          <CustomTableHead onRequestSort={onRequestSort} order={order} orderBy={orderBy} />
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <BookingTypeIconWrapper>
                    {row.isIncome ? <ArrowCircleUpIcon color="primary" /> : <ArrowCircleDownIcon color="error" />}
                    {row.repetition !== Repetition.ONCE && <ReplayIcon color="secondary" />}
                  </BookingTypeIconWrapper>
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell sx={(theme) => ({ color: theme.palette[row.isIncome ? 'primary' : 'error'].main })}>
                  {row.amount} €
                </TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.note}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={(event) => onOpenPopover(row.id!, event.currentTarget)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25]}
          labelDisplayedRows={labelDisplayedRows}
          labelRowsPerPage="Zeilen pro Seite:"
          count={filteredBookings.length}
          rowsPerPage={rowsPerPage}
          page={bookingTablePage <= filteredBookings.length / rowsPerPage ? bookingTablePage : 0}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
        <Popover
          open={!!popoverReference}
          anchorEl={popoverReference?.anchorElement}
          onClose={onClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
          <PopoverButtonWrapper>
            <StyledButton
              color="secondary"
              startIcon={<EditIcon />}
              onClick={onUpdateClick(popoverReference?.referencedBookingId ?? 0)}
            >
              Bearbeiten
            </StyledButton>
            <StyledButton
              color="secondary"
              startIcon={<DeleteForeverIcon />}
              onClick={onDeleteClick(popoverReference?.referencedBookingId ?? 0)}
            >
              Löschen
            </StyledButton>
          </PopoverButtonWrapper>
        </Popover>
      </StyledBox>
      <CreateBooking />
      <ImportAccountStatement />
      <UpdateBooking />
      <DeleteBooking />
    </>
  );
}
