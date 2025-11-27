// Модуль полноэкранного просмотра фотографии
const body = document.body;
const bigPicture = document.querySelector('.big-picture');
const bigPictureImgContainer = bigPicture.querySelector('.big-picture__img');
const bigPictureImg = bigPictureImgContainer.querySelector('img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentCountBlock = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('#picture-cancel');

/**
 * Создаёт DOM-элемент комментария по данным comment
 * @param {{avatar: string, name: string, message: string}} comment
 * @returns {HTMLElement}
 */
const createCommentElement = (comment) => {
  const li = document.createElement('li');
  li.className = 'social__comment';

  const img = document.createElement('img');
  img.className = 'social__picture';
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const p = document.createElement('p');
  p.className = 'social__text';
  p.textContent = comment.message;

  li.appendChild(img);
  li.appendChild(p);

  return li;
};

let onDocumentKeydown;
let activeThumbnail = null;

// -------------------------
// Пагинация комментариев
// -------------------------
const COMMENTS_PORTION = 5;
let commentsToShow = [];
let renderedCommentsCount = 0;

// Функция отрисовки следующей порции
const renderNextComments = () => {
  const next = commentsToShow.slice(
    renderedCommentsCount,
    renderedCommentsCount + COMMENTS_PORTION
  );

  const fragment = document.createDocumentFragment();

  next.forEach((c) => {
    const commentData = {
      avatar: c.avatar || c.avatarUrl || '',
      name: c.name || c.author || 'Пользователь',
      message: c.message || c.text || ''
    };
    fragment.appendChild(createCommentElement(commentData));
  });

  socialComments.appendChild(fragment);

  renderedCommentsCount += next.length;

  // Обновление счётчика
  commentCountBlock.innerHTML =
  `<span class="count-badge">Вы лицезреете ${renderedCommentsCount} из ${commentsToShow.length} комментариев</span>`;

  // Скрыть кнопку, если комментарии закончились
  if (renderedCommentsCount >= commentsToShow.length) {
    commentsLoader.classList.add('hidden');
  }
};

// Обработчик клика "Загрузить ещё"
const onCommentsLoaderClick = () => {
  renderNextComments();
};



/**
 * Закрывает окно полноразмерного просмотра
 */
export const closeBigPicture = () => {
  // --- убрать подсветку миниатюры ---
  if (activeThumbnail) {
    activeThumbnail.classList.remove('picture--active');
    activeThumbnail = null;
  }

  // Удаление обработчиков
  if (onDocumentKeydown) {
    document.removeEventListener('keydown', onDocumentKeydown);
    onDocumentKeydown = null;
  }
  if (closeButton) {
    closeButton.removeEventListener('click', closeBigPicture);
  }

  commentsLoader.removeEventListener('click', onCommentsLoaderClick);

  // Скрыть модалку
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');

  // Очистить комментарии
  socialComments.innerHTML = '';
};


/**
 * Открывает окно полноразмерного просмотра с данными photo
 * @param {Object} photo
 * @param {number} photo.id
 * @param {string} photo.url
 * @param {string} photo.description
 * @param {number} photo.likes
 * @param {Array} photo.comments
 */
export const openBigPicture = (photo, thumbnailElement) => {
  if (!photo) return;

  // --- подсветка миниатюры ---
  if (activeThumbnail) {
    activeThumbnail.classList.remove('picture--active');
  }
  activeThumbnail = thumbnailElement;
  activeThumbnail.classList.add('picture--active');

  // Заполняем данные изображения
  bigPictureImg.src = photo.url;
  bigPictureImg.alt = photo.description || 'Фотография';
  likesCount.textContent = String(photo.likes);
  commentsCount.textContent = String(photo.comments.length);
  socialCaption.textContent = photo.description || '';

  // Показываем блоки счётчика и кнопки
  commentCountBlock.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  // Подготовка комментариев
  commentsToShow = Array.isArray(photo.comments) ? photo.comments : [];
  renderedCommentsCount = 0;
  socialComments.innerHTML = '';

  if (commentsToShow.length > 0) {
    renderNextComments();
  } else {
    commentCountBlock.textContent = 'Нет комментариев';
    commentsLoader.classList.add('hidden');
  }


  commentsLoader.addEventListener('click', onCommentsLoaderClick);

  // Показать окно
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  // Закрытие по Escape
  onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closeBigPicture();
    }
  };
  document.addEventListener('keydown', onDocumentKeydown);

  // Закрытие по кнопке
  if (closeButton) {
    closeButton.addEventListener('click', closeBigPicture);
  }
};


