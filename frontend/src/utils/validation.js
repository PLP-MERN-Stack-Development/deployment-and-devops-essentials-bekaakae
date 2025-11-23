export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validateOrderData = (orderData) => {
  const errors = {};

  if (!orderData.customer.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!orderData.customer.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(orderData.customer.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!orderData.customer.phone?.trim()) {
    errors.phone = 'Phone is required';
  } else if (!validatePhone(orderData.customer.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!orderData.customer.address?.trim()) {
    errors.address = 'Address is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};