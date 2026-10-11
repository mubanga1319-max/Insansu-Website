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
  if (links) {
    var li = document.createElement('li');
    li.innerHTML = '<a class="nav-cta" href="https://wa.me/260760538552?text=Hello%20Insansu%20Venture%2C%20I%27d%20like%20to%20order%20fresh%20produce.">Order</a>';
    links.appendChild(li);
  }
  var yearEls = document.querySelectorAll('.year');
  yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  var wa = document.createElement('a');
  wa.className = 'wa-float';
  wa.href = 'https://wa.me/260760538552?text=Hello%20Insansu%20Venture%2C%20I%27d%20like%20to%20ask%20about%20your%20produce.';
  wa.setAttribute('aria-label', 'Chat with Insansu Venture on WhatsApp');
  wa.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 3C9.4 3 4 8.38 4 15c0 2.36.69 4.56 1.87 6.42L4 29l7.77-1.83A12.02 12.02 0 0 0 16.04 27C22.68 27 28 21.62 28 15S22.68 3 16.04 3zm0 21.9c-1.9 0-3.67-.55-5.16-1.5l-.37-.22-4.6 1.08 1.1-4.48-.24-.38A9.86 9.86 0 0 1 6.1 15c0-5.46 4.46-9.9 9.94-9.9 5.48 0 9.9 4.44 9.9 9.9s-4.42 9.9-9.9 9.9zm5.44-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"/></svg><span>Chat on WhatsApp</span>';
  document.body.appendChild(wa);
});
