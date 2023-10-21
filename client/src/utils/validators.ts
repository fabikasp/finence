import { CONFIRMATION_TEXT } from './const';

const EMAIL_REGEX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
const MAX_EMAIL_LENGTH = 320;

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

const MAX_CATEGORY_NAME_LENGTH = 50;
const MAX_CATEGORY_DESCRIPTION_LENGTH = 200;

export function validateEmail(email: string, login?: boolean): string {
  if (email === '') {
    return 'Die E-Mail-Adresse darf nicht leer sein.';
  }

  if (login) {
    return '';
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return `Die E-Mail-Adresse darf maximal ${MAX_EMAIL_LENGTH} Zeichen enthalten.`;
  }

  return !EMAIL_REGEX.test(email) ? 'Die E-Mail-Adresse ist nicht gültig.' : '';
}

export function validatePassword(password: string, login?: boolean): string {
  if (password === '') {
    return 'Das Passwort darf nicht leer sein.';
  }

  if (login) {
    return '';
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Das Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen enthalten.`;
  }

  return password.length > MAX_PASSWORD_LENGTH
    ? `Das Passwort darf maximal ${MAX_PASSWORD_LENGTH} Zeichen enthalten.`
    : '';
}

export function validateRepeatedPassword(repeatedPassword: string, password: string): string {
  if (repeatedPassword === '') {
    return 'Das Passwort darf nicht leer sein.';
  }

  return repeatedPassword !== password ? 'Die Passwörter müssen identisch sein.' : '';
}

export function validateConfirmation(confirmation: string): string {
  return confirmation !== CONFIRMATION_TEXT ? `Die Eingabe muss dem Wort „${CONFIRMATION_TEXT}“ entsprechen.` : '';
}

export function validateCategoryName(categoryName: string): string {
  if (categoryName === '') {
    return 'Der Name darf nicht leer sein.';
  }

  return categoryName.length > MAX_CATEGORY_NAME_LENGTH
    ? `Der Name darf maximal ${MAX_CATEGORY_NAME_LENGTH} Zeichen enthalten.`
    : '';
}

export function validateCategoryDescription(categoryDescription: string): string {
  return categoryDescription.length > MAX_CATEGORY_DESCRIPTION_LENGTH
    ? `Die Beschreibung darf maximal ${MAX_CATEGORY_DESCRIPTION_LENGTH} Zeichen enthalten.`
    : '';
}
