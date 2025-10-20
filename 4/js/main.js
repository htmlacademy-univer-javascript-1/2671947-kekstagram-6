// Функция для генерации случайного числа в диапазоне
const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};


// Функция для создания массива уникальных идентификаторов
const generateUniqueIds = (count) => {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(getRandomInteger(1, 1000));
  }
  return Array.from(ids);
};


// Данные для генерации
const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Артём', 'Мария', 'Дмитрий', 'Анна', 'Сергей',
  'Елена', 'Алексей', 'Ольга', 'Иван', 'Наталья',
  'Павел', 'Юлия', 'Михаил', 'Екатерина', 'Андрей'
];

const DESCRIPTIONS = [
  'Прекрасный закат на море',
  'Горный пейзаж в утреннем тумане',
  'Улицы старого города',
  'Летний день в парке',
  'Архитектура современного мегаполиса',
  'Лесная тропинка после дождя',
  'Ночной город в огнях',
  'Зимний пейзаж с заснеженными деревьями',
  'Морской берег с волнами',
  'Городской фестиваль и праздник'
];


// Функция для получения случайного элемента из массива
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];


// Функция для генерации комментариев
const generateComments = () => {
  const commentsCount = getRandomInteger(0, 30);

  const commentIds = generateUniqueIds(commentsCount);

  const commentsArray = [];

  for (let i = 0; i < commentsCount; i++) {
    // Создаем один комментарий
    const singleComment = {
      id: commentIds[i], // Берем уникальный ID из подготовленного массива
      avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`, // Случайная аватарка от 1 до 6
      message: getRandomArrayElement(MESSAGES), // Случайное сообщение из списка
      name: getRandomArrayElement(NAMES) // Случайное имя из списка
    };

    // Добавляем комментарий в массив
    commentsArray.push(singleComment);
  }

  return commentsArray;
};


// Функция для генерации массива фотографий
const generatePhotos = () => {
  // Создаем массив для хранения всех фотографий
  const photosArray = [];

  // Создаем 25 фотографий (от 0 до 24)
  for (let i = 0; i < 25; i++) {
    // Создаем объект для одной фотографии
    const singlePhoto = {
      id: i + 1,                    // ID от 1 до 25
      url: `photos/${i + 1}.jpg`,   // Адрес: photos/1.jpg, photos/2.jpg и т.д.
      description: getRandomArrayElement(DESCRIPTIONS), // Случайное описание
      likes: getRandomInteger(15, 200), // Случайное число лайков от 15 до 200
      comments: generateComments()  // Генерируем массив комментариев
    };

    // Добавляем готовую фотографию в общий массив
    photosArray.push(singlePhoto);
  }

  return photosArray;
};

// Создаем и экспортируем массив фотографий
const photos = generatePhotos();

