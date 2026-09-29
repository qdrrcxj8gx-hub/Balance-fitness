'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  navigation.classList.remove('open');
  document.body.classList.remove('menu-open');
}
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
  navigation.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 601px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.class-card');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  cards.forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
  });
}));
const direction = document.querySelector('#direction');
document.querySelectorAll('[data-class]').forEach(button => button.addEventListener('click', () => {
  direction.value = button.dataset.class;
  document.querySelector('#booking').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
  document.querySelector('#name').focus({ preventScroll: true });
}));
const nameInput = document.querySelector('#name');
nameInput.addEventListener('input', () => nameInput.setCustomValidity(''));
document.querySelector('#booking-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.setCustomValidity('Пожалуйста, напиши своё имя.');
    nameInput.reportValidity();
    return;
  }
  const message = `Здравствуйте! Меня зовут ${name}. Хочу на первое занятие в Balance на Сыганак, 58/1. Направление: ${direction.value}. Подскажите, пожалуйста, расписание и стоимость.`;
  window.open(`https://wa.me/77475150904?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});
document.querySelector('#year').textContent = new Date().getFullYear();

// A lightweight, local recommendation: no answers are stored or sent.
const moods = {
  calm: { title: 'Yoga Mix', label: 'ВЫДОХНУТЬ. ЗАМЕДЛИТЬСЯ.', description: 'Отложи список дел. Движение и дыхание помогут уделить внимание тому, как ты чувствуешь себя сейчас.' },
  strong: { title: 'TRX', label: 'ПОЧУВСТВОВАТЬ СВОЮ СИЛУ.', description: 'Хочется движения и энергии? Попробуй упражнения с подвесными петлями и собственным весом — с вниманием к технике.' },
  flex: { title: 'Stretching', label: 'ДОБАВИТЬ ДВИЖЕНИЯМ СВОБОДЫ.', description: 'Не обязательно сразу садиться на шпагат. Начни с растяжки в комфортной амплитуде и маленьких открытий о своём теле.' },
  free: { title: 'High Heels', label: 'РАЗРЕШИТЬ СЕБЕ БОЛЬШЕ.', description: 'Музыка, пластика и немного смелости. Попробуй выразить настроение через танец и открыть для себя новое движение.' }
};
document.querySelectorAll('[data-mood]').forEach(button => button.addEventListener('click', () => {
  const mood = moods[button.dataset.mood];
  document.querySelectorAll('[data-mood]').forEach(option => {
    const active = option === button;
    option.classList.toggle('selected', active);
    option.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('#mood-label').textContent = mood.label;
  document.querySelector('#mood-class').textContent = mood.title;
  document.querySelector('#mood-description').textContent = mood.description;
  document.querySelector('#mood-book').dataset.class = mood.title;
}));
document.querySelector('.copy-address').addEventListener('click', async () => {
  const address = 'Астана, улица Сыганак, 58/1, ЖК Europa Palace III';
  const status = document.querySelector('#copy-status');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(address);
    status.textContent = 'Адрес скопирован. До встречи!';
  } catch {
    status.textContent = address;
    const range = document.createRange();
    range.selectNodeContents(status);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
// Keep the mobile actions out of the way while filling in the form.
if ('IntersectionObserver' in window) {
  const dock = document.querySelector('.mobile-dock');
  const bookingObserver = new IntersectionObserver(entries => {
    const visible = entries[0].isIntersecting;
    dock.style.visibility = visible ? 'hidden' : '';
  }, { threshold: 0.15 });
  bookingObserver.observe(document.querySelector('#booking'));
}
