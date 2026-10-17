/* Contact: the note form. There is no backend, so it builds a mailto link;
   nothing is stored or sent by the page itself. */
(function () {
  // No backend: the form builds a mailto link. Nothing is stored or sent by the page itself.
  var form = document.getElementById('note-form');
  var name = document.getElementById('f-name'), email = document.getElementById('f-email'), msg = document.getElementById('f-msg');
  var err = document.getElementById('f-err'), done = document.getElementById('f-done');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = [];
    [name, email, msg].forEach(function (f) { f.removeAttribute('aria-invalid'); });
    if (!name.value.trim()) bad.push([name, 'your name']);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) bad.push([email, 'a valid email']);
    if (!msg.value.trim()) bad.push([msg, 'a message']);
    if (bad.length) {
      bad.forEach(function (b) { b[0].setAttribute('aria-invalid', 'true'); });
      err.textContent = 'Please add ' + bad.map(function (b) { return b[1]; }).join(', ') + '.';
      err.hidden = false; done.hidden = true; bad[0][0].focus(); return;
    }
    err.hidden = true;
    var subject = 'Portfolio enquiry from ' + name.value.trim();
    var body = msg.value.trim() + '\n\n' + name.value.trim() + '\n' + email.value.trim();
    window.location.href = 'mailto:' + window.CONTACT.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    done.hidden = false;
  });
})();
