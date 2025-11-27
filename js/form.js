// form.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#upload-select-image');
  const uploadFileInput = document.querySelector('#upload-file');
  const uploadOverlay = document.querySelector('.img-upload__overlay');
  const uploadCancel = document.querySelector('#upload-cancel');
  const body = document.body;

  // Проверяем, что элементы существуют
  if (!form || !uploadFileInput || !uploadOverlay) {
    return;
  }

  // Элементы формы
  const hashtagsInput = form.querySelector('.text__hashtags');
  const descriptionInput = form.querySelector('.text__description');
  const submitButton = form.querySelector('#upload-submit');

  // Объявляем функции в правильном порядке зависимостей
  const hideEditForm = () => {
    uploadOverlay.classList.add('hidden');
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', onDocumentKeydown);
    form.reset();
  };

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape' && !evt.target.matches('.text__hashtags, .text__description')) {
      evt.preventDefault();
      hideEditForm();
    }
  };

  const showEditForm = () => {
    uploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
  };

  const validateHashtags = (value) => {
    if (!value.trim()) {
      return true;
    }

    const hashtags = value.trim().toLowerCase().split(/\s+/);
    const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

    if (hashtags.length > 5) {
      return false;
    }

    for (const hashtag of hashtags) {
      if (!hashtagRegex.test(hashtag)) {
        return false;
      }
    }

    const uniqueHashtags = new Set(hashtags);
    if (uniqueHashtags.size !== hashtags.length) {
      return false;
    }

    return true;
  };

  const validateDescription = (value) => value.length <= 140;

  const validateFormManually = () => {
    const description = descriptionInput.value.trim();
    if (description.length > 140) {
      return false;
    }

    const hashtags = hashtagsInput.value.trim();
    if (hashtags) {
      const hashtagsArray = hashtags.split(/\s+/);
      const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

      if (hashtagsArray.length > 5) {
        return false;
      }

      for (const tag of hashtagsArray) {
        if (!hashtagRegex.test(tag)) {
          return false;
        }
      }

      const uniqueTags = new Set(hashtagsArray.map((tag) => tag.toLowerCase()));
      if (uniqueTags.size !== hashtagsArray.length) {
        return false;
      }
    }

    return true;
  };

  // Создание экземпляра Pristine (только если Pristine доступен)
  let pristine;
  if (typeof Pristine !== 'undefined') {
    pristine = new Pristine(form, {
      classTo: 'img-upload__field-wrapper',
      errorTextParent: 'img-upload__field-wrapper',
      errorTextClass: 'img-upload__field-wrapper--error'
    });

    pristine.addValidator(
      hashtagsInput,
      validateHashtags,
      'Неправильный формат хэш-тегов. Хэш-теги должны начинаться с #, содержать только буквы и цифры, быть уникальными и не более 5 штук'
    );

    pristine.addValidator(
      descriptionInput,
      validateDescription,
      'Комментарий не может быть длиннее 140 символов'
    );
  }

  // Обработчики событий
  uploadFileInput.addEventListener('change', () => {
    showEditForm();
  });

  if (uploadCancel) {
    uploadCancel.addEventListener('click', (evt) => {
      evt.preventDefault();
      hideEditForm();
    });
  }

  // Предотвращение закрытия формы при фокусе в полях ввода
  if (hashtagsInput && descriptionInput) {
    [hashtagsInput, descriptionInput].forEach((input) => {
      input.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape') {
          evt.stopPropagation();
        }
      });
    });
  }

  // Обработчик отправки формы - СТАНДАРТНАЯ ОТПРАВКА
  form.addEventListener('submit', (evt) => {
    // Проверяем валидность формы
    let isValid = true;
    if (pristine) {
      isValid = pristine.validate();
    } else {
      isValid = validateFormManually();
    }

    if (!isValid) {
      evt.preventDefault();
      return;
    }

    // Блокировка кнопки отправки
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Отправка...';
    }

    // На всякий случай добавляем таймаут для разблокировки кнопки
    setTimeout(() => {
      if (submitButton && submitButton.disabled) {
        submitButton.disabled = false;
        submitButton.textContent = 'Опубликовать';
      }
    }, 5000);
  });
});
