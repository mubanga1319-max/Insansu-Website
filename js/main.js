document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.gap = '1rem';
      links.style.position = 'absolute';
      links.style.top = '100%';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'var(--cream)';
      links.style.padding = '1.3rem var(--gutter)';
      links.style.borderBottom = '1px solid var(--rule)';
      toggle.setAttribute('aria-expanded', String(!open));
    });
  }
  var yearEls = document.querySelectorAll('.year');
  yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });
});
