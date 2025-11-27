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

/**
 * Открывает окно полноразмерного просмотра с данными photo
 * @param {Object} photo
 * @param {number} photo.id
 * @param {string} photo.url
 * @param {string} photo.description
 * @param {number} photo.likes
 * @param {Array} photo.comments  — массив объектов {id, avatar, message, name}
 */
export const openBigPicture = (photo, thumbnailElement) => {
  if (!photo) return;
  // --- подсветка миниатюры ---
  if (activeThumbnail) {
    activeThumbnail.classList.remove('picture--active');
  }
  activeThumbnail = thumbnailElement;
  activeThumbnail.classList.add('picture--active');



  // Заполняем данные
  bigPictureImg.src = photo.url;
  bigPictureImg.alt = photo.description || 'Фотография';
  likesCount.textContent = String(photo.likes);
  commentsCount.textContent = String(photo.comments.length);
  socialCaption.textContent = photo.description || '';

  // Очищаем старые комментарии и вставляем новые
  socialComments.innerHTML = '';
  if (Array.isArray(photo.comments) && photo.comments.length > 0) {
    const fragment = document.createDocumentFragment();
    photo.comments.forEach((c) => {
      // если структура комментария чуть другая — поддерживаем поля avatar/name/message
      const commentData = {
        avatar: c.avatar || c.avatarUrl || '',
        name: c.name || c.author || 'Пользователь',
        message: c.message || c.text || ''
      };
      fragment.appendChild(createCommentElement(commentData));
    });
    socialComments.appendChild(fragment);
  }

  // Скрываем блок счётчика комментариев и кнопку загрузки (по условию)
  if (commentCountBlock) commentCountBlock.classList.add('hidden');
  if (commentsLoader) commentsLoader.classList.add('hidden');

  // Показать окно и запретить скролл фона
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  // Обработчик закрытия по Escape
  onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closeBigPicture();
    }
  };
  document.addEventListener('keydown', onDocumentKeydown);

  // Закрытие по кнопке (иконке)
  if (closeButton) {
    closeButton.addEventListener('click', closeBigPicture);
  }
};

/**
 * Закрывает окно полноразмерного просмотра
 */
export const closeBigPicture = () => {
  // --- убрать подсветку ---
  if (activeThumbnail) {
    activeThumbnail.classList.remove('picture--active');
    activeThumbnail = null;
  }

  // Снять слушатели
  if (onDocumentKeydown) {
    document.removeEventListener('keydown', onDocumentKeydown);
    onDocumentKeydown = null;
  }
  if (closeButton) {
    closeButton.removeEventListener('click', closeBigPicture);
  }

  // Скрыть модалку и восстановить скролл
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');

  // Очистить комментарии (на случай следующего открытия)
  socialComments.innerHTML = '';

  // Убрать скрытие с блоков на будущее (чтобы не сломать интерфейс в других заданиях)
  if (commentCountBlock) commentCountBlock.classList.remove('hidden');
  if (commentsLoader) commentsLoader.classList.remove('hidden');
};
