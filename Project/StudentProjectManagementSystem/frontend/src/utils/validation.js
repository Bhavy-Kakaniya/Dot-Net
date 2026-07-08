export function validateEmail(email) {
  if (!email?.trim()) return 'Email is required';
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email)) return 'Enter a valid email address';
  return '';
}

export function validateRequired(value, fieldName) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${fieldName} is required`;
  }
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
}

export function validateForm(fields) {
  const errors = {};
  Object.entries(fields).forEach(([key, { value, rules }]) => {
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[key] = error;
        break;
      }
    }
  });
  return errors;
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}
