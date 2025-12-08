document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#upload-select-image');
  const uploadFileInput = document.querySelector('#upload-file');
  const uploadOverlay = document.querySelector('.img-upload__overlay');
  const uploadCancel = document.querySelector('#upload-cancel');
  const body = document.body;

  if (!form || !uploadFileInput || !uploadOverlay) {
    return;
  }

  const hashtagsInput = form.querySelector('.text__hashtags');
  const descriptionInput = form.querySelector('.text__description');
  const submitButton = form.querySelector('#upload-submit');

  // Объявляем переменную pristine в начале
  let pristine = null;

  // Объявляем hideEditForm
  const hideEditForm = () => {
    uploadOverlay.classList.add('hidden');
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', onDocumentKeydown);
    form.reset();

    // Сбрасываем ошибки Pristine
    if (pristine) {
      pristine.reset();
    }
  };

  // Объявляем showEditForm
  const showEditForm = () => {
    uploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
  };

  // Объявляем onDocumentKeydown
  function onDocumentKeydown(evt) {
    if (evt.key === 'Escape' && !evt.target.matches('.text__hashtags, .text__description')) {
      evt.preventDefault();
      hideEditForm();
    }
  }

  // Функции валидации
  const validateHashtags = (value) => {
    if (!value.trim()) {
      return true;
    }

    const hashtags = value.trim().split(/\s+/);

    if (hashtags.length > 5) {
      return false;
    }

    const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

    for (const hashtag of hashtags) {
      if (!hashtagRegex.test(hashtag)) {
        return false;
      }
    }

    const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
    const uniqueHashtags = new Set(lowerCaseHashtags);

    return uniqueHashtags.size === hashtags.length;
  };

  const validateDescription = (value) => value.length <= 140;

  // Инициализация Pristine
  if (typeof window.Pristine !== 'undefined') {
    pristine = new Pristine(form, {
      classTo: 'img-upload__field-wrapper',
      errorTextParent: 'img-upload__field-wrapper',
      errorTextClass: 'img-upload__field-wrapper--error',
      errorTextTag: 'div'
    });

    pristine.addValidator(
      hashtagsInput,
      validateHashtags,
      'Неправильный формат хештегов. Хештеги должны:' +
      '• Начинаться с #' +
      '• Содержать только буквы и цифры' +
      '• Иметь длину от 1 до 19 символов после #' +
      '• Быть уникальными (регистр не учитывается)' +
      '• Максимум 5 хештегов'
    );

    pristine.addValidator(
      descriptionInput,
      validateDescription,
      'Максимальная длина комментария - 140 символов'
    );
  }

  // Обработчики событий
  uploadFileInput.addEventListener('change', showEditForm);

  if (uploadCancel) {
    uploadCancel.addEventListener('click', (evt) => {
      evt.preventDefault();
      hideEditForm();
    });
  }

  // Предотвращение закрытия формы при фокусе
  if (hashtagsInput) {
    hashtagsInput.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        evt.stopPropagation();
      }
    });
  }

  if (descriptionInput) {
    descriptionInput.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        evt.stopPropagation();
      }
    });
  }

  // Обработчик отправки формы
  form.addEventListener('submit', (evt) => {
    let isValid = false;

    if (pristine) {
      isValid = pristine.validate();
    } else {
      const hashtagsValid = validateHashtags(hashtagsInput.value);
      const descriptionValid = validateDescription(descriptionInput.value);
      isValid = hashtagsValid && descriptionValid;
    }

    if (!isValid) {
      evt.preventDefault();
      return;
    }

    // Блокировка кнопки
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Отправка...';
    }
  });

  // Дополнительно: Валидация в реальном времени
  if (hashtagsInput) {
    hashtagsInput.addEventListener('input', () => {
      if (pristine) {
        pristine.validate(hashtagsInput);
      }
    });
  }
});
