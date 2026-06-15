const form = document.getElementById('studentLoginForm');
const studentId = document.getElementById('studentId');
const password = document.getElementById('password');
const showPassword = document.getElementById('showPassword');

showPassword.addEventListener('change', () => {
  password.type = showPassword.checked ? 'text' : 'password';
});

function setInvalid(input, invalid) {
  input.closest('.field-group').classList.toggle('is-invalid', invalid);
}

[studentId, password].forEach(input => {
  input.addEventListener('input', () => {
    setInvalid(input, !input.value.trim());
  });
});

form.addEventListener('submit', event => {
  event.preventDefault();

  const missingStudentId = !studentId.value.trim();
  const missingPassword = !password.value.trim();

  setInvalid(studentId, missingStudentId);
  setInvalid(password, missingPassword);

  if (missingStudentId || missingPassword) {
    return;
  }

  alert('Student login submitted.');
});
