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

  // Масштаб
  const scaleSmallerBtn = form.querySelector('.scale__control--smaller');
  const scaleBiggerBtn = form.querySelector('.scale__control--bigger');
  const scaleValueInput = form.querySelector('.scale__control--value');
  const previewImage = form.querySelector('.img-upload__preview img');
  const defaultPreviewSrc = previewImage.src; // сохраняем дефолтное изображение

  // Эффекты
  const effectLevelField = form.querySelector('.img-upload__effect-level');
  const effectLevelValue = form.querySelector('.effect-level__value');
  const effectSliderNode = form.querySelector('.effect-level__slider');

  // Pristine
  let pristine = null;

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
    const lower = hashtags.map((h) => h.toLowerCase());
    return new Set(lower).size === lower.length;
  };

  const validateDescription = (value) => value.length <= 140;

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
      'Неправильный формат хештегов. Хештеги должны:\n• Начинаться с #\n• Содержать только буквы и цифры\n• Длина от 1 до 19 символов после #\n• Быть уникальными\n• Максимум 5 хештегов'
    );

    pristine.addValidator(
      descriptionInput,
      validateDescription,
      'Максимальная длина комментария - 140 символов'
    );
  }

  // --- МАСШТАБ ---
  const SCALE_STEP = 25;
  const SCALE_MIN = 25;
  const SCALE_MAX = 100;
  const SCALE_DEFAULT = 100;

  const parseScale = (text) => {
    if (!text) {
      return SCALE_DEFAULT;
    }
    const n = parseInt(String(text).replace('%', ''), 10);
    return isNaN(n) ? SCALE_DEFAULT : n;
  };

  const applyScale = (percent) => {
    const clamped = Math.min(SCALE_MAX, Math.max(SCALE_MIN, percent));
    if (previewImage) {
      previewImage.style.transform = `scale(${clamped / 100})`;
    }
    if (scaleValueInput) {
      scaleValueInput.value = `${clamped}%`;
    }
  };

  if (scaleBiggerBtn) {
    scaleBiggerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const cur = parseScale(scaleValueInput.value);
      applyScale(cur + SCALE_STEP);
    });
  }

  if (scaleSmallerBtn) {
    scaleSmallerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const cur = parseScale(scaleValueInput.value);
      applyScale(cur - SCALE_STEP);
    });
  }

  const initScale = () => {
    const cur = parseScale(scaleValueInput.value);
    if (!scaleValueInput.value || isNaN(cur)) {
      scaleValueInput.value = `${SCALE_DEFAULT}%`;
      applyScale(SCALE_DEFAULT);
    } else {
      applyScale(Math.min(SCALE_MAX, Math.max(SCALE_MIN, cur)));
    }
  };

  // --- ЭФФЕКТЫ ---
  const EFFECT_CONFIG = {
    none: { visible: false },
    chrome: {
      range: { min: 0, max: 1 },
      step: 0.1,
      start: 1,
      apply: (v) => {
        previewImage.style.filter = `grayscale(${v})`;
      },
      visible: true
    },
    sepia: {
      range: { min: 0, max: 1 },
      step: 0.1,
      start: 1,
      apply: (v) => {
        previewImage.style.filter = `sepia(${v})`;
      },
      visible: true
    },
    marvin: {
      range: { min: 0, max: 100 },
      step: 1,
      start: 100,
      apply: (v) => {
        previewImage.style.filter = `invert(${Math.round(v)}%)`;
      },
      visible: true
    },
    phobos: {
      range: { min: 0, max: 3 },
      step: 0.1,
      start: 3,
      apply: (v) => {
        previewImage.style.filter = `blur(${Math.round(v * 10) / 10}px)`;
      },
      visible: true
    },
    heat: {
      range: { min: 1, max: 3 },
      step: 0.1,
      start: 3,
      apply: (v) => {
        previewImage.style.filter = `brightness(${Math.round(v * 10) / 10})`;
      },
      visible: true
    }
  };

  let currentEffect = 'none';
  let sliderCreated = false;

  const createOrUpdateSlider = (config) => {
    if (!effectSliderNode) {
      return;
    }

    if (typeof window.noUiSlider === 'undefined' || !window.noUiSlider.create) {
      if (effectLevelField) {
        effectLevelField.classList.add('hidden');
      }
      return;
    }

    const options = {
      start: config.start,
      connect: 'lower',
      range: config.range,
      step: config.step
    };

    if (!sliderCreated) {
      window.noUiSlider.create(effectSliderNode, options);
      sliderCreated = true;

      effectSliderNode.noUiSlider.on('update', (values, handle) => {
        const v = parseFloat(values[handle]);
        if (effectLevelValue) {
          const step = config.step;
          const recorded = step >= 1 ? Math.round(v) : Math.round(v * 10) / 10;
          effectLevelValue.value = recorded;
        }
        if (currentEffect !== 'none') {
          EFFECT_CONFIG[currentEffect].apply(parseFloat(v));
        }
      });
    } else {
      effectSliderNode.noUiSlider.updateOptions(
        { range: config.range, step: config.step, start: config.start },
        false
      );
      try {
        effectSliderNode.noUiSlider.set(config.start);
      } catch (err) {
        // ignore
      }
    }
  };

  const setEffect = (name) => {
    if (!EFFECT_CONFIG[name]) {
      name = 'none';
    }

    currentEffect = name;
    const cfg = EFFECT_CONFIG[name];

    if (cfg.visible) {
      if (effectLevelField) {
        effectLevelField.classList.remove('hidden');
      }
      createOrUpdateSlider(cfg);
      if (effectLevelValue) {
        const val = cfg.step >= 1 ? Math.round(cfg.start) : Math.round(cfg.start * 10) / 10;
        effectLevelValue.value = val;
      }
      if (previewImage) {
        cfg.apply(cfg.start);
      }
    } else {
      if (effectLevelField) {
        effectLevelField.classList.add('hidden');
      }
      if (previewImage) {
        previewImage.style.filter = '';
      }
      if (effectLevelValue) {
        effectLevelValue.value = '';
      }
    }

    if (previewImage) {
      previewImage.classList.remove(
        'effects__preview--none',
        'effects__preview--chrome',
        'effects__preview--sepia',
        'effects__preview--marvin',
        'effects__preview--phobos',
        'effects__preview--heat'
      );
      previewImage.classList.add(`effects__preview--${name}`);
    }
  };

  // --- Показ/скрытие формы ---
  function hideEditForm() {
    uploadOverlay.classList.add('hidden');
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', onDocumentKeydown);
    form.reset();

    if (pristine) {
      pristine.reset();
    }

    applyScale(SCALE_DEFAULT);

    const noneRadio = form.querySelector('input[name="effect"][value="none"]');
    if (noneRadio) {
      noneRadio.checked = true;
    }
    setEffect('none');

    // возвращаем дефолтное изображение
    previewImage.src = defaultPreviewSrc;
  }

  function onDocumentKeydown(evt) {
    if (evt.key === 'Escape' && !evt.target.matches('.text__hashtags, .text__description')) {
      evt.preventDefault();
      hideEditForm();
    }
  }

  function showEditForm() {
    uploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
    initScale();
    const cur = form.querySelector('input[name="effect"]:checked');
    setEffect(cur ? cur.value : 'none');
  }

  // обработка выбора файла и показ превью
  uploadFileInput.addEventListener('change', (evt) => {
    const file = evt.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result; // показываем выбранное фото
      };
      reader.readAsDataURL(file);
    }
    showEditForm();
  });

  if (uploadCancel) {
    uploadCancel.addEventListener('click', (e) => {
      e.preventDefault();
      hideEditForm();
    });
  }

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

  form.addEventListener('submit', (evt) => {
    let isValid = false;
    if (pristine) {
      isValid = pristine.validate();
    } else {
      isValid = validateHashtags(hashtagsInput.value) && validateDescription(descriptionInput.value);
    }
    if (!isValid) {
      evt.preventDefault();
      return;
    }
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Отправка...';
    }
  });

  if (hashtagsInput) {
    hashtagsInput.addEventListener('input', () => {
      if (pristine) {
        pristine.validate(hashtagsInput);
      }
    });
  }

  initScale();
  setEffect('none');

  // обработка переключения эффектов
  form.querySelectorAll('input[name="effect"]').forEach((input) => {
    input.addEventListener('change', () => {
      setEffect(input.value);
    });
  });
});
