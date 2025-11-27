// form.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#upload-select-image');
  const uploadFileInput = document.querySelector('#upload-file');
  const uploadOverlay = document.querySelector('.img-upload__overlay');
  const uploadCancel = document.querySelector('#upload-cancel');
  const body = document.body;

  // Проверяем, что элементы существуют
  if (!form || !uploadFileInput || !uploadOverlay) {
    console.error('Не найдены необходимые элементы формы');
    return;
  }

  // Элементы формы
  const hashtagsInput = form.querySelector('.text__hashtags');
  const descriptionInput = form.querySelector('.text__description');
  const submitButton = form.querySelector('#upload-submit');

  // Функция для показа формы редактирования
  const showEditForm = () => {
    uploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
  };

  // Функция для скрытия формы редактирования
  const hideEditForm = () => {
    uploadOverlay.classList.add('hidden');
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', onDocumentKeydown);
    form.reset();
  };

  // Обработчик закрытия по Esc
  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape' && !evt.target.matches('.text__hashtags, .text__description')) {
      evt.preventDefault();
      hideEditForm();
    }
  };

  // Валидация хэш-тегов
  const validateHashtags = (value) => {
    if (!value.trim()) {
      return true; // Пустое значение допустимо
    }

    const hashtags = value.trim().toLowerCase().split(/\s+/);
    const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

    // Проверка на максимальное количество
    if (hashtags.length > 5) {
      return false;
    }

    // Проверка каждого хэш-тега
    for (const hashtag of hashtags) {
      if (!hashtagRegex.test(hashtag)) {
        return false;
      }
    }

    // Проверка на уникальность
    const uniqueHashtags = new Set(hashtags);
    if (uniqueHashtags.size !== hashtags.length) {
      return false;
    }

    return true;
  };

  // Валидация комментария
  const validateDescription = (value) => {
    return value.length <= 140;
  };

  // Создание экземпляра Pristine (только если Pristine доступен)
  let pristine;
  if (typeof Pristine !== 'undefined') {
    pristine = new Pristine(form, {
      classTo: 'img-upload__field-wrapper',
      errorTextParent: 'img-upload__field-wrapper',
      errorTextClass: 'img-upload__field-wrapper--error'
    });

    // Добавление валидаторов
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

  // Функция ручной валидации (резервная)
  const validateFormManually = () => {
    const description = descriptionInput.value.trim();
    if (description.length > 140) {
      alert('Комментарий слишком длинный! Максимум 140 символов.');
      return false;
    }

    const hashtags = hashtagsInput.value.trim();
    if (hashtags) {
      const hashtagsArray = hashtags.split(/\s+/);
      const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

      // Проверка на максимальное количество
      if (hashtagsArray.length > 5) {
        alert('Слишком много хэш-тегов! Максимум 5.');
        return false;
      }

      // Проверка каждого хэш-тега
      for (const tag of hashtagsArray) {
        if (!hashtagRegex.test(tag)) {
          alert(`Неправильный хэш-тег: ${tag}`);
          return false;
        }
      }

      // Проверка на уникальность
      const uniqueTags = new Set(hashtagsArray.map(tag => tag.toLowerCase()));
      if (uniqueTags.size !== hashtagsArray.length) {
        alert('Хэш-теги не должны повторяться!');
        return false;
      }
    }

    return true;
  };

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
    [hashtagsInput, descriptionInput].forEach(input => {
      input.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape') {
          evt.stopPropagation();
        }
      });
    });
  }

  // Обработчик отправки формы - СТАНДАРТНАЯ ОТПРАВКА
  form.addEventListener('submit', (evt) => {
    // НЕ предотвращаем отправку по умолчанию - форма отправится стандартным способом

    console.log('✅ Обработчик submit вызван');
    console.log('📝 Данные формы:');
    console.log('Хэш-теги:', hashtagsInput?.value);
    console.log('Комментарий:', descriptionInput?.value);

    // Проверяем валидность формы
    let isValid = true;
    if (pristine) {
      isValid = pristine.validate();
      console.log('✅ Pristine валидация:', isValid);
    } else {
      // Резервная валидация если Pristine не доступен
      isValid = validateFormManually();
      console.log('✅ Ручная валидация:', isValid);
    }

    if (!isValid) {
      console.log('❌ Форма не валидна, отправка отменена');
      evt.preventDefault(); // ТОЛЬКО ЗДЕСЬ предотвращаем отправку невалидной формы
      return;
    }

    // Блокировка кнопки отправки
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Отправка...';
    }

    console.log('📤 Отправляем данные на сервер стандартным способом...');
    console.log('После отправки браузер перейдет на:', form.action);

    // Форма отправится стандартным способом, перейдя на страницу сервера
    // Браузер автоматически выполнит POST запрос с multipart/form-data

    // На всякий случай добавляем таймаут для разблокировки кнопки
    // (если страница не перезагрузится по какой-то причине)
    setTimeout(() => {
      if (submitButton && submitButton.disabled) {
        submitButton.disabled = false;
        submitButton.textContent = 'Опубликовать';
        console.log('⚠️ Кнопка разблокирована по таймауту (страница не перезагрузилась)');
      }
    }, 5000);
  });

  // Функция для показа сообщения об успехе (не используется при стандартной отправке)
  const showSuccessMessage = () => {
    const successTemplate = document.querySelector('#success');
    if (successTemplate) {
      const successElement = successTemplate.content.cloneNode(true);
      document.body.appendChild(successElement);

      const successSection = document.querySelector('.success');
      const successButton = document.querySelector('.success__button');

      if (successButton) {
        const closeSuccess = () => {
          successSection.remove();
          document.removeEventListener('keydown', onSuccessKeydown);
          document.removeEventListener('click', onSuccessClick);
        };

        successButton.addEventListener('click', closeSuccess);

        const onSuccessKeydown = (evt) => {
          if (evt.key === 'Escape') {
            closeSuccess();
          }
        };

        const onSuccessClick = (evt) => {
          if (evt.target === successSection) {
            closeSuccess();
          }
        };

        document.addEventListener('keydown', onSuccessKeydown);
        document.addEventListener('click', onSuccessClick);
      }
    }
  };

  // Функция для показа сообщения об ошибке (не используется при стандартной отправке)
  const showErrorMessage = () => {
    const errorTemplate = document.querySelector('#error');
    if (errorTemplate) {
      const errorElement = errorTemplate.content.cloneNode(true);
      document.body.appendChild(errorElement);

      const errorSection = document.querySelector('.error');
      const errorButton = document.querySelector('.error__button');

      if (errorButton) {
        const closeError = () => {
          errorSection.remove();
          document.removeEventListener('keydown', onErrorKeydown);
          document.removeEventListener('click', onErrorClick);
        };

        errorButton.addEventListener('click', closeError);

        const onErrorKeydown = (evt) => {
          if (evt.key === 'Escape') {
            closeError();
          }
        };

        const onErrorClick = (evt) => {
          if (evt.target === errorSection) {
            closeError();
          }
        };

        document.addEventListener('keydown', onErrorKeydown);
        document.addEventListener('click', onErrorClick);
      }
    }
  };

  console.log('✅ Модуль form.js загружен и инициализирован');
});
