import { getRandomInteger, getRandomArrayElement, generateUniqueIds } from './util.js';
import { MESSAGES, NAMES, DESCRIPTIONS } from './data.js';

// Функция для генерации комментариев
export const generateComments = () => {
  const commentsCount = getRandomInteger(0, 30);
  const commentIds = generateUniqueIds(commentsCount);
  const commentsArray = [];

  for (let i = 0; i < commentsCount; i++) {
    const singleComment = {
      id: commentIds[i],
      avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
      message: getRandomArrayElement(MESSAGES),
      name: getRandomArrayElement(NAMES)
    };

    commentsArray.push(singleComment);
  }

  return commentsArray;
};

// Функция для генерации массива фотографий
export const generatePhotos = () => {
  const photosArray = [];

  for (let i = 0; i < 25; i++) {
    const singlePhoto = {
      id: i + 1,
      url: `photos/${i + 1}.jpg`,
      description: getRandomArrayElement(DESCRIPTIONS),
      likes: getRandomInteger(15, 200),
      comments: generateComments()
    };

    photosArray.push(singlePhoto);
  }

  return photosArray;
};
