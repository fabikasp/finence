import React from 'react';
import {
  Box,
  IconButton,
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
import IntervalSelection from './IntervalSelection';
import moment from 'moment';

interface Booking {
  readonly id: number;
  readonly date: string;
  readonly amount: number;
  readonly category: string;
  readonly note: string;
}

const rows: Booking[] = [...Array(10)].map((_, i) => ({
  id: i + 1,
  date: moment().toLocaleString(),
  amount: 42 + i,
  category: 'Testkategorie' + i,
  note: 'Testbemerkung' + i
}));

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] === a[orderBy]) {
    return 0;
  }

  return b[orderBy] < a[orderBy] ? -1 : 1;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
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
  readonly id: keyof Booking;
  readonly label: string;
  readonly numeric: boolean;
}

const headCells: HeadCell[] = [
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
];

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  '& .MuiTableSortLabel-icon': {
    color: `${theme.palette.text.primary} !important`
  }
}));

interface CustomTableHeadProps {
  readonly order: Order;
  readonly orderBy: string;
  readonly onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Booking) => void;
}

function CustomTableHead(props: CustomTableHeadProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Booking) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

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
      </TableRow>
    </TableHead>
  );
}

const StyledBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.text.primary}`,
  borderRadius: theme.shape.borderRadius
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  float: 'right',
  borderBottom: 0,
  '& .MuiSelect-icon': {
    color: theme.palette.text.primary
  }
}));

export default function BookingsTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Booking>('amount');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const onRequestSort = (_: React.MouseEvent<unknown>, property: keyof Booking) => {
    const isAsc = orderBy === property && order === 'asc';

    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const onChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const onChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const labelDisplayedRows = ({ from, to, count }: { from: number; to: number; count: number }) =>
    `${from}–${to} von ${count}`;

  const visibleRows = React.useMemo(
    () => stableSort(rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  );

  return (
    <StyledBox>
      <IntervalSelection />
      <Table size="small">
        <CustomTableHead onRequestSort={onRequestSort} order={order} orderBy={orderBy} />
        <TableBody>
          {visibleRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.note}</TableCell>
              <TableCell align="right">
                <IconButton color="primary">
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <StyledTablePagination
        rowsPerPageOptions={[5, 10, 25]}
        labelDisplayedRows={labelDisplayedRows}
        labelRowsPerPage="Zeilen pro Seite:"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </StyledBox>
  );
}
