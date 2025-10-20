/* eslint-disable no-unused-vars */

function checkLen(string, maxlen) {
  return string.lenght <= maxlen;
}


function isPalindrome(string) {
  // Приводим строку к нижнему регистру и удаляем пробелы
  const cleanString = string.toLowerCase().replaceAll(' ', '');

  // Сравниваем строку с перевернутой версие
  return cleanString === cleanString.split('').reverse().join('');
}

