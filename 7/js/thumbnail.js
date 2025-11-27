// Модуль для отрисовки миниатюр фотографий
import { photos } from './main.js';

// Находим шаблон и контейнер для миниатюр
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const picturesContainer = document.querySelector('.pictures');

// Функция для создания DOM-элемента миниатюры
const createThumbnail = (photoData) => {
  const thumbnail = pictureTemplate.cloneNode(true);
  const image = thumbnail.querySelector('.picture__img');
  const comments = thumbnail.querySelector('.picture__comments');
  const likes = thumbnail.querySelector('.picture__likes');

  // Заполняем данные
  image.src = photoData.url;
  image.alt = photoData.description;
  comments.textContent = photoData.comments.length;
  likes.textContent = photoData.likes;

  // Добавляем data-атрибут для идентификации фотографии
  thumbnail.dataset.photoId = photoData.id;

  return thumbnail;
};

// Функция для отрисовки всех миниатюр
const renderThumbnails = () => {
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const thumbnail = createThumbnail(photo);
    fragment.appendChild(thumbnail);
  });

  // Находим элемент, перед которым нужно вставить миниатюры
  const imgUploadSection = picturesContainer.querySelector('.img-upload');

  // Вставляем миниатюры перед секцией загрузки
  picturesContainer.insertBefore(fragment, imgUploadSection);
};

// Экспортируем функцию для отрисовки
export { renderThumbnails };
