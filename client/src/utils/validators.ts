import { CONFIRMATION_TEXT } from './const';

const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
const MAX_EMAIL_LENGTH = 320;

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

const MAX_CATEGORY_NAME_LENGTH = 50;
const MAX_CATEGORY_DESCRIPTION_LENGTH = 200;
const MAX_CATEGORY_KEY_WORDS_LENGTH = 400;

const MAX_BOOKING_NOTE_LENGTH = 200;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MIN_CSV_FILE_ROWS = 2;
const MAX_CSV_FILE_ROWS = 500;

const MAX_COLUMN_LABEL_LENGTH = 80;

export function validateEmail(email: string, login?: boolean): string | undefined {
  if (email === '') {
    return 'Die E-Mail-Adresse darf nicht leer sein.';
  }

  if (login) {
    return undefined;
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return `Die E-Mail-Adresse darf maximal ${MAX_EMAIL_LENGTH} Zeichen enthalten.`;
  }

  return !EMAIL_REGEX.test(email) ? 'Die E-Mail-Adresse ist nicht gültig.' : undefined;
}

export function validatePassword(password: string, login?: boolean): string | undefined {
  if (password === '') {
    return 'Das Passwort darf nicht leer sein.';
  }

  if (login) {
    return undefined;
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Das Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen enthalten.`;
  }

  return password.length > MAX_PASSWORD_LENGTH
    ? `Das Passwort darf maximal ${MAX_PASSWORD_LENGTH} Zeichen enthalten.`
    : undefined;
}

export function validateRepeatedPassword(repeatedPassword: string, password: string): string | undefined {
  if (repeatedPassword === '') {
    return 'Das Passwort darf nicht leer sein.';
  }

  return repeatedPassword !== password ? 'Die Passwörter müssen identisch sein.' : undefined;
}

export function validateConfirmation(confirmation: string): string | undefined {
  return confirmation !== CONFIRMATION_TEXT
    ? `Die Eingabe muss dem Wort „${CONFIRMATION_TEXT}“ entsprechen.`
    : undefined;
}

export function validateCategoryName(categoryName: string): string | undefined {
  if (categoryName === '') {
    return 'Der Name darf nicht leer sein.';
  }

  return categoryName.length > MAX_CATEGORY_NAME_LENGTH
    ? `Der Name darf maximal ${MAX_CATEGORY_NAME_LENGTH} Zeichen enthalten.`
    : undefined;
}

export function validateCategoryDescription(categoryDescription: string): string | undefined {
  return categoryDescription.length > MAX_CATEGORY_DESCRIPTION_LENGTH
    ? `Die Beschreibung darf maximal ${MAX_CATEGORY_DESCRIPTION_LENGTH} Zeichen enthalten.`
    : undefined;
}

export function validateCategoryKeyWords(categoryKeyWords: string): string | undefined {
  return categoryKeyWords.length > MAX_CATEGORY_KEY_WORDS_LENGTH
    ? `Die Stichwörter dürfen maximal ${MAX_CATEGORY_KEY_WORDS_LENGTH} Zeichen enthalten.`
    : undefined;
}

export function validateBookingDate(bookingDate: number | null): string | undefined {
  return bookingDate === null ? 'Das Datum darf nicht leer sein.' : undefined;
}

export function validateBookingAmount(bookingAmount: string): string | undefined {
  if (bookingAmount === '') {
    return 'Der Betrag darf nicht leer sein.';
  }

  const castedAmount = Number(bookingAmount);
  if (isNaN(castedAmount)) {
    return 'Der Betrag muss eine Zahl sein.';
  }

  return castedAmount <= 0 ? 'Der Betrag muss größer als 0 sein.' : undefined;
}

export function validateBookingNote(bookingNote: string): string | undefined {
  return bookingNote.length > MAX_BOOKING_NOTE_LENGTH
    ? `Die Bemerkung darf maximal ${MAX_BOOKING_NOTE_LENGTH} Zeichen enthalten.`
    : undefined;
}

export function validateBookingImage(imageFile: Blob): string | undefined {
  if (!imageFile.type.startsWith('image/')) {
    return 'Es muss eine Bilddatei angegeben werden.';
  }

  return imageFile.size > MAX_FILE_SIZE ? `Die Datei darf maximal ${MAX_FILE_SIZE} Bytes groß sein.` : undefined;
}

export function validateCsvFile(csvFileName: string, csvFileContent: string, csvFileSize: number): string | undefined {
  if (csvFileName === '' || csvFileContent === '') {
    return 'Es muss eine Datei angegeben werden.';
  }

  if (csvFileSize > MAX_FILE_SIZE) {
    return `Die Datei darf maximal ${MAX_FILE_SIZE} Bytes groß sein.`;
  }

  if (!csvFileName.endsWith('.csv')) {
    return 'Die Datei muss vom Typ CSV sein.';
  }

  const csvFileRows = csvFileContent.split('\n');
  if (csvFileRows.length < MIN_CSV_FILE_ROWS) {
    return 'Die Datei enthält zu wenige Zeilen.';
  }

  return csvFileRows.length > MAX_CSV_FILE_ROWS ? 'Die Datei enthält zu viele Zeilen.' : undefined;
}

export function validateColumnLabel(columnLabel: string, csvFileContent: string): string | undefined {
  if (columnLabel === '') {
    return 'Der Spaltenname darf nicht leer sein.';
  }

  if (columnLabel.length > MAX_COLUMN_LABEL_LENGTH) {
    return `Der Spaltenname darf maximal ${MAX_COLUMN_LABEL_LENGTH} Zeichen enthalten.`;
  }

  return !csvFileContent.includes(columnLabel) ? 'Der Spaltenname muss in der Datei vorkommen.' : undefined;
}
