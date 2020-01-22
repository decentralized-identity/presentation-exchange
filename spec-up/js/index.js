
window.addEventListener('keypress', e => {
  if (e.shiftKey && e.keyCode === 84) {
    console.log(window.location.hash);
    window.location.hash = window.location.hash === '#sidebar' ? '_' : 'sidebar';
  }
})