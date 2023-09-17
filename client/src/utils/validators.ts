const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const MAX_EMAIL_LENGTH = 320;
const MAX_PASSWORD_LENGTH = 128;

export function validateEmail(email: string): string {
  if (email === '') {
    return 'Die E-Mail-Adresse darf nicht leer sein.';
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return `Die E-Mail-Adresse darf maximal ${MAX_EMAIL_LENGTH} Zeichen enthalten.`;
  }

  return !EMAIL_REGEX.test(email) ? 'Die E-Mail-Adresse ist nicht gültig.' : '';
}

export function validatePassword(password: string): string {
  if (password === '') {
    return 'Das Passwort darf nicht leer sein.';
  }

  return password.length > MAX_PASSWORD_LENGTH
    ? `Das Passwort darf maximal ${MAX_PASSWORD_LENGTH} Zeichen enthalten.`
    : '';
}
