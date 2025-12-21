const successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
const errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
const body = document.querySelector('body');

function isEscapeKey(evt) {
  return evt.key === 'Escape' || evt.key === 'Esc';
}

function onMessageEscKeydown(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    hideMessage();
  }
}

function onOutsideClick(evt) {
  if (evt.target.closest('.success__inner') || evt.target.closest('.error__inner')) {
    return;
  }
  hideMessage();
}

function hideMessage() {
  const messageElement = document.querySelector('.success') || document.querySelector('.error');
  if (messageElement) {
    messageElement.remove();
  }
  document.removeEventListener('keydown', onMessageEscKeydown);
  document.removeEventListener('click', onOutsideClick);
  body.classList.remove('modal-open');
}

function showMessage(template, closeButtonClass) {
  const messageElement = template.cloneNode(true);
  document.body.append(messageElement);

  const closeButton = messageElement.querySelector(closeButtonClass);

  closeButton.addEventListener('click', hideMessage);
  document.addEventListener('keydown', onMessageEscKeydown);
  document.addEventListener('click', onOutsideClick);
  // Note: We don't add 'modal-open' to body here strictly because the form modal is likely already open
  // and we don't want to mess up scroll locking logic of the underlying form.
}

const showSuccessMessage = () => showMessage(successMessageTemplate, '.success__button');
const showErrorMessage = () => showMessage(errorMessageTemplate, '.error__button');

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';
  alertContainer.style.color = 'white';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, 5000);
};

export { showSuccessMessage, showErrorMessage, showAlert };
