import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* Change to ul, li */
  const ul = document.createElement('ul');
  ul.classList.add('card-list');

  let sliderActive = block.children.length > 2;

  let visibleItems = 3;

  if(window.innerWidth <= 767) {
    visibleItems = 1;
  } else if (window.innerWidth > 1200) {
    sliderActive = block.children.length > 3;
  }

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('card-item');

    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    [...li.children].forEach((div) => {
      const pictures = div.querySelectorAll('picture');

      if (pictures.length > 0) {
        div.className = 'card-carousel-image';
      } else {
        div.className = 'card-carousel-body';
      }
    });

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])
    );
  });

  block.textContent = '';
  block.append(ul);

  if (sliderActive) {
    const leftArrow = document.createElement('div');
    leftArrow.classList.add('leftSlider');
    block.append(leftArrow);

    const rightArrow = document.createElement('div');
    rightArrow.classList.add('rightSlider');
    block.append(rightArrow);

    let currentIndex = 0;
    const cardList = block.querySelector('.card-list');
    const cardItems = block.querySelectorAll('.card-item');
    const leftButton = block.querySelector('.leftSlider');
    const rightButton = block.querySelector('.rightSlider');

    const updateButtons = () => {
      leftButton.classList.toggle('inactive', currentIndex === 0);
      rightButton.classList.toggle('inactive', currentIndex >= cardItems.length - visibleItems);
    };

    const updateActiveClasses = () => {
      cardItems.forEach((card, index) => {
        card.classList.remove('active');
        if (index >= currentIndex && index < currentIndex + visibleItems) {
          card.classList.add('active');
        }
      });
    };

    const moveSlider = (direction) => {
      const cardWidth = cardItems[0].offsetWidth;
      if (direction === 'left' && currentIndex > 0) {
        currentIndex--;
      } else if (direction === 'right' && currentIndex < cardItems.length - visibleItems) {
        currentIndex++;
      }
      cardList.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      updateButtons();
      updateActiveClasses();
    };

    updateButtons();
    updateActiveClasses();

    leftButton.addEventListener('click', () => moveSlider('left'));
    rightButton.addEventListener('click', () => moveSlider('right'));
  } else {
    block.querySelectorAll('.card-item').forEach((item) => {
      item.classList.add('active');
    });
  }
}