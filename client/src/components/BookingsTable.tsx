import React, { useState, useMemo, useCallback } from 'react';
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
  TablePaginationProps,
  TableRow,
  TableSortLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IntervalSelection from './IntervalSelection';
import moment from 'moment';

interface Booking {
  readonly id: number;
  readonly isIncome: boolean;
  readonly date: string;
  readonly amount: number;
  readonly category: string;
  readonly note: string;
}

const rows: Booking[] = [...Array(10)].map((_, i) => ({
  id: i + 1,
  isIncome: !!(i % 2),
  date: moment().toLocaleString(),
  amount: 42 + i,
  category: 'Testkategorie' + i,
  note: 'Testbemerkung' + i
}));

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  if (b[orderBy] === a[orderBy]) {
    return 0;
  }

  return b[orderBy] < a[orderBy] ? -1 : 1;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof Booking>(
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

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  '& .MuiTableSortLabel-icon': {
    color: `${theme.palette.text.primary} !important`
  }
}));

interface HeadCell {
  readonly id: keyof Booking;
  readonly label: string;
  readonly numeric: boolean;
}

interface CustomTableHeadProps {
  readonly order: Order;
  readonly orderBy: string;
  readonly onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Booking) => void;
}

function CustomTableHead(props: CustomTableHeadProps): React.ReactNode {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Booking) => (event: React.MouseEvent<unknown>) => {
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
            <StyledTableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </StyledTableSortLabel>
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

const StyledTablePagination = styled(TablePagination)<TablePaginationProps>(({ theme }) => ({
  '& .MuiSelect-icon': {
    color: theme.palette.text.primary
  }
}));

const BookingTypeIconWrapper = styled(Box)(() => ({
  marginTop: 4
}));

const PopoverButtonWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: 5
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  justifyContent: 'left',
  padding: '5px 10px 0px'
}));

const StyledFab = styled(Fab)(() => ({
  marginRight: 15
}));

export default function BookingsTable(): React.ReactNode {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Booking>('amount');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [popoverAnchorElement, setPopoverAnchorElement] = useState<HTMLButtonElement | undefined>(undefined);

  const onRequestSort = useCallback(
    (_: React.MouseEvent<unknown>, property: keyof Booking) => {
      const isAsc = orderBy === property && order === 'asc';

      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    },
    [order, orderBy]
  );

  const onOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => setPopoverAnchorElement(event.currentTarget);
  const onClosePopover = () => setPopoverAnchorElement(undefined);

  const onChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  }, []);

  const labelDisplayedRows = useCallback(
    ({ from, to, count }: { from: number; to: number; count: number }) => `${from}–${to} von ${count}`,
    []
  );

  const visibleRows = useMemo(
    () => stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  );

  return (
    <StyledBox>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <IntervalSelection />
        <StyledFab color="primary" size="small">
          <AddIcon />
        </StyledFab>
      </Box>
      <Table size="small">
        <CustomTableHead onRequestSort={onRequestSort} order={order} orderBy={orderBy} />
        <TableBody>
          {visibleRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <BookingTypeIconWrapper>
                  {row.isIncome ? <ArrowCircleUpIcon color="primary" /> : <ArrowCircleDownIcon color="error" />}
                </BookingTypeIconWrapper>
              </TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell sx={(theme) => ({ color: theme.palette[row.isIncome ? 'primary' : 'error'].main })}>
                {row.amount}
              </TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.note}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={onOpenPopover}>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <StyledTablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        labelDisplayedRows={labelDisplayedRows}
        labelRowsPerPage="Zeilen pro Seite:"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
      <Popover
        open={!!popoverAnchorElement}
        anchorEl={popoverAnchorElement}
        onClose={onClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <PopoverButtonWrapper>
          <StyledButton color="secondary" startIcon={<EditIcon />}>
            Bearbeiten
          </StyledButton>
          <StyledButton color="secondary" startIcon={<DeleteForeverIcon />}>
            Löschen
          </StyledButton>
        </PopoverButtonWrapper>
      </Popover>
    </StyledBox>
  );
}
