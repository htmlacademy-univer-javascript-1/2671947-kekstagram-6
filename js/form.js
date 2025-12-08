// form.js
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
  const scaleValueInput = form.querySelector('.scale__control--value'); // readonly, формат "75%"
  const previewImage = form.querySelector('.img-upload__preview img');

  // Эффекты
  const effectsList = form.querySelector('.effects__list');
  const effectLevelField = form.querySelector('.img-upload__effect-level'); // контейнер слайдера
  const effectLevelValue = form.querySelector('.effect-level__value'); // поле для отправки
  const effectSliderNode = form.querySelector('.effect-level__slider');

  // Pristine (валидация)
  let pristine = null;

  const validateHashtags = (value) => {
    if (!value.trim()) return true;
    const hashtags = value.trim().split(/\s+/);
    if (hashtags.length > 5) return false;
    const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;
    for (const hashtag of hashtags) if (!hashtagRegex.test(hashtag)) return false;
    const lower = hashtags.map(h => h.toLowerCase());
    return new Set(lower).size === hashtags.length;
  };

  const validateDescription = (value) => value.length <= 140;

  if (typeof window.Pristine !== 'undefined') {
    pristine = new Pristine(form, {
      classTo: 'img-upload__field-wrapper',
      errorTextParent: 'img-upload__field-wrapper',
      errorTextClass: 'img-upload__field-wrapper--error',
      errorTextTag: 'div'
    });
    pristine.addValidator(hashtagsInput, validateHashtags,
      'Неправильный формат хештегов. Хештеги должны:\n• Начинаться с #\n• Содержать только буквы и цифры\n• Длина от 1 до 19 символов после #\n• Быть уникальными\n• Максимум 5 хештегов'
    );
    pristine.addValidator(descriptionInput, validateDescription,
      'Максимальная длина комментария - 140 символов'
    );
  }

  // --- МАСШТАБ ---
  const SCALE_STEP = 25;
  const SCALE_MIN = 25;
  const SCALE_MAX = 100;
  const SCALE_DEFAULT = 100;

  const parseScale = (text) => {
    if (!text) return SCALE_DEFAULT;
    const n = parseInt(String(text).replace('%', ''), 10);
    return isNaN(n) ? SCALE_DEFAULT : n;
  };

  const applyScale = (percent) => {
    const clamped = Math.min(SCALE_MAX, Math.max(SCALE_MIN, percent));
    if (previewImage) previewImage.style.transform = `scale(${clamped / 100})`;
    if (scaleValueInput) scaleValueInput.value = `${clamped}%`;
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

  // --- ЭФФЕКТЫ через noUiSlider (диапазоны и шаги по ТЗ) ---
  // Описание эффектов: range, step, start (start = максимум, т.е. "100%")
  const EFFECT_CONFIG = {
    none:  { visible: false },
    chrome:{ range: { min: 0, max: 1 }, step: 0.1, start: 1, apply: (v)=> previewImage.style.filter = `grayscale(${v})`, visible: true },
    sepia: { range: { min: 0, max: 1 }, step: 0.1, start: 1, apply: (v)=> previewImage.style.filter = `sepia(${v})`, visible: true },
    marvin:{ range: { min: 0, max: 100 }, step: 1, start: 100, apply: (v)=> previewImage.style.filter = `invert(${Math.round(v)}%)`, visible: true },
    phobos:{ range: { min: 0, max: 3 }, step: 0.1, start: 3, apply: (v)=> previewImage.style.filter = `blur(${Math.round(v*10)/10}px)`, visible: true },
    heat:  { range: { min: 1, max: 3 }, step: 0.1, start: 3, apply: (v)=> previewImage.style.filter = `brightness(${Math.round(v*10)/10})`, visible: true }
  };

  let currentEffect = 'none';
  let sliderCreated = false;

  const createOrUpdateSlider = (config) => {
    if (!effectSliderNode) return;
    if (typeof window.noUiSlider === 'undefined' || !window.noUiSlider.create) {
      // noUiSlider отсутствует — скрываем контрол и выходим
      if (effectLevelField) effectLevelField.classList.add('hidden');
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
      // слушатель обновлений
      effectSliderNode.noUiSlider.on('update', (values, handle) => {
        const v = parseFloat(values[handle]);
        // запишем значение в поле (для отправки) — читаемая величина в единицах эффекта
        if (effectLevelValue) {
          // округлим адекватно в зависимости от шага
          const step = config.step;
          let recorded = v;
          if (step >= 1) recorded = Math.round(v);
          else recorded = Math.round(v * 10) / 10;
          effectLevelValue.value = recorded;
        }
        // применяем стиль
        if (currentEffect !== 'none') {
          EFFECT_CONFIG[currentEffect].apply(parseFloat(v));
        }
      });
    } else {
      // updateOptions + set start to max (start in config is max)
      effectSliderNode.noUiSlider.updateOptions({
        range: config.range,
        step: config.step,
        start: config.start
      }, false);
      // установить значение в start (максимум) сразу
      try {
        effectSliderNode.noUiSlider.set(config.start);
      } catch (err) {
        // для безопасности
      }
    }
  };

  const setEffect = (name) => {
    if (!EFFECT_CONFIG[name]) name = 'none';
    currentEffect = name;

    const cfg = EFFECT_CONFIG[name];

    // Показываем/скрываем контейнер слайдера
    if (cfg.visible) {
      if (effectLevelField) effectLevelField.classList.remove('hidden');
      // инициализируем/обновляем слайдер с нужными параметрами и ставим на старт (max)
      createOrUpdateSlider(cfg);
      // Обновим поле effectLevelValue значением start
      if (effectLevelValue) {
        // при createOrUpdateSlider listener заполнит effectLevelValue после установки
        // но для надёжности установим здесь:
        const startVal = cfg.start;
        effectLevelValue.value = (cfg.step >= 1) ? Math.round(startVal) : Math.round(startVal * 10) / 10;
      }
      // применим стиль сразу
      if (previewImage) {
        EFFECT_CONFIG[name].apply(cfg.start);
      }
    } else {
      // none: скрыть контейнер, удалить фильтр, очистить поле
      if (effectLevelField) effectLevelField.classList.add('hidden');
      if (previewImage) previewImage.style.filter = '';
      if (effectLevelValue) effectLevelValue.value = '';
    }

    // обновим css-класс превью (если используете классы превью)
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

  // слушаем переключение эффектов
  if (effectsList) {
    effectsList.addEventListener('change', (e) => {
      const input = e.target;
      if (!input || input.name !== 'effect') return;
      setEffect(input.value);
    });
  }

  // --- Показ/скрытие формы редактирования ---
  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape' && !evt.target.matches('.text__hashtags, .text__description')) {
      evt.preventDefault();
      hideEditForm();
    }
  };

  const hideEditForm = () => {
    uploadOverlay.classList.add('hidden');
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', onDocumentKeydown);
    form.reset();

    if (pristine) pristine.reset();

    // сброс масштаба и эффектов
    applyScale(SCALE_DEFAULT);
    // вернуть эффект на none
    const noneRadio = form.querySelector('input[name="effect"][value="none"]');
    if (noneRadio) noneRadio.checked = true;
    setEffect('none');
  };

  const showEditForm = () => {
    uploadOverlay.classList.remove('hidden');
    body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
    initScale();
    // инициализируем слайдер (если нужен)
    // Установим эффект по тому, что выбрано в форме (если нет — none)
    const cur = form.querySelector('input[name="effect"]:checked');
    setEffect(cur ? cur.value : 'none');
  };

  // обработчики
  uploadFileInput.addEventListener('change', showEditForm);
  if (uploadCancel) {
    uploadCancel.addEventListener('click', (e) => {
      e.preventDefault();
      hideEditForm();
    });
  }

  if (hashtagsInput) {
    hashtagsInput.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') evt.stopPropagation();
    });
  }
  if (descriptionInput) {
    descriptionInput.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') evt.stopPropagation();
    });
  }

  // submit
  form.addEventListener('submit', (evt) => {
    let isValid = false;
    if (pristine) isValid = pristine.validate();
    else isValid = validateHashtags(hashtagsInput.value) && validateDescription(descriptionInput.value);

    if (!isValid) {
      evt.preventDefault();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Отправка...';
    }
  });

  // realtime validation
  if (hashtagsInput) {
    hashtagsInput.addEventListener('input', () => {
      if (pristine) pristine.validate(hashtagsInput);
    });
  }

  // init
  initScale();
  // Настройка слайдера не создаётся до выбора эффекта, но подготовим контейнер видимость/скрытие
  // По умолчанию эффект "none"
  setEffect('none');
});
