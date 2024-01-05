import { CONFIRMATION_TEXT } from './const';

const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
const MAX_EMAIL_LENGTH = 320;

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

const MAX_CATEGORY_NAME_LENGTH = 50;
const MAX_CATEGORY_DESCRIPTION_LENGTH = 200;

const MAX_BOOKING_NOTE_LENGTH = 200;

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

export function validateBookingCategory(bookingCategory: string): string | undefined {
  return bookingCategory === '' ? 'Die Kategorie darf nicht leer sein.' : undefined;
}

export function validateBookingNote(bookingNote: string): string | undefined {
  return bookingNote.length > MAX_BOOKING_NOTE_LENGTH
    ? `Die Bemerkung darf maximal ${MAX_BOOKING_NOTE_LENGTH} Zeichen enthalten.`
    : undefined;
}
