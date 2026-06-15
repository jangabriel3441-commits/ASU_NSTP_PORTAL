document.getElementById('studentBtn').addEventListener('click', () => {
  window.location.href = 'student_login.html';
});

document.getElementById('instructorBtn').addEventListener('click', () => {
  alert('Instructor login coming soon.');
});

document.querySelectorAll('a[href="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    alert(link.textContent + ' page coming soon.');
  });
});
