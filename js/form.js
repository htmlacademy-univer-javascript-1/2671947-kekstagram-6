document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#upload-select-image');
  const uploadFileInput = document.querySelector('#upload-file');
  const uploadOverlay = document.querySelector('.img-upload__overlay');
  const uploadCancel = document.querySelector('#upload-cancel');
  const body = document.body;

  if (!form || !uploadFileInput || !uploadOverlay) {
    console.error('Не найдены необходимые элементы формы');
    return;
  }

  const hashtagsInput = form.querySelector('.text__hashtags');
  const descriptionInput = form.querySelector('.text__description');
  const submitButton = form.querySelector('#upload-submit');

  // Объявляем hideEditForm ДО её использования
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

  // Объявляем showEditForm ДО её использования
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
      return true; // Пустое поле - валидно
    }

    const hashtags = value.trim().split(/\s+/);

    // Проверка количества
    if (hashtags.length > 5) {
      return false;
    }

    // Регулярное выражение для проверки формата
    const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

    // Проверка каждого хештега
    for (const hashtag of hashtags) {
      if (!hashtagRegex.test(hashtag)) {
        return false;
      }
    }

    // Проверка уникальности (без учета регистра)
    const lowerCaseHashtags = hashtags.map(tag => tag.toLowerCase());
    const uniqueHashtags = new Set(lowerCaseHashtags);

    return uniqueHashtags.size === hashtags.length;
  };

  const validateDescription = (value) => {
    return value.length <= 140;
  };

  // Инициализация Pristine
  let pristine = null;

  if (typeof window.Pristine !== 'undefined') {
    console.log('Pristine доступен');

    pristine = new Pristine(form, {
      classTo: 'img-upload__field-wrapper',
      errorTextParent: 'img-upload__field-wrapper',
      errorTextClass: 'img-upload__field-wrapper--error',
      errorTextTag: 'div'
    });

    // Валидатор для хештегов
    pristine.addValidator(
      hashtagsInput,
      validateHashtags,
      'Неправильный формат хештегов. Хештеги должны:<br>' +
      '• Начинаться с #<br>' +
      '• Содержать только буквы и цифры<br>' +
      '• Иметь длину от 1 до 19 символов после #<br>' +
      '• Быть уникальными (регистр не учитывается)<br>' +
      '• Максимум 5 хештегов'
    );

    // Валидатор для описания
    pristine.addValidator(
      descriptionInput,
      validateDescription,
      'Максимальная длина комментария - 140 символов'
    );

    console.log('Pristine инициализирован');
  } else {
    console.warn('Pristine не найден. Используется ручная валидация.');
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
    console.log('Форма отправляется...');

    let isValid = false;

    if (pristine) {
      console.log('Используется Pristine для валидации');
      isValid = pristine.validate();
      console.log('Pristine валидация:', isValid);
    } else {
      console.log('Используется ручная валидация');
      // Ручная валидация
      const hashtagsValid = validateHashtags(hashtagsInput.value);
      const descriptionValid = validateDescription(descriptionInput.value);
      isValid = hashtagsValid && descriptionValid;
      console.log('Хештеги валидны:', hashtagsValid);
      console.log('Описание валидно:', descriptionValid);
    }

    if (!isValid) {
      console.log('Форма невалидна, отправка отменена');
      evt.preventDefault();

      // Показываем ошибки
      if (pristine) {
        console.log('Ошибки Pristine:');
        console.log(pristine.getErrors());
      }

      return;
    }

    console.log('Форма валидна, отправка продолжается');

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
        const isValid = pristine.validate(hashtagsInput);
        console.log('Валидация хештегов в реальном времени:', isValid);
      }
    });
  }
});
