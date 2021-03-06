import '../css/style.css';
import $ from 'jquery';
import testImg from '../images/testImg.png';
import testSvg from '../images/Freesample.svg';

const currentTime = () => {
  const date = new Date();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${hour < 10 ? '0' + hour : hour}시 ${minutes < 10 ? '0' + minutes : minutes}분 ${seconds < 10 ? '0' + seconds : seconds}초`;
}

const timerElement = document.createElement('article');
timerElement.id = 'timer';

const imgElement = document.createElement('img');
imgElement.src = testSvg;

setInterval(() => {
  timerElement.innerHTML = currentTime();
}, 1000);

document.querySelector('#content').appendChild(timerElement);
document.querySelector('#content').appendChild(imgElement);
console.log($('section').children().length);
console.log(IS_PRODUCTION);