(function () {
  var todayStr = new Date().toISOString().split('T')[0];
  var dateInput = document.getElementById('su-date');
  dateInput.value = todayStr;
  dateInput.max = todayStr;

  var idInput = document.getElementById('su-id');
  var componentSelect = document.getElementById('su-component');
  var yearSelect = document.getElementById('su-year');
  var passInput = document.getElementById('su-pass');
  var pass2Input = document.getElementById('su-pass2');
  var submitBtn = document.getElementById('submit-btn');
  var successMsg = document.getElementById('success-msg');

  function showErr(id, visible) {
    document.getElementById(id).classList.toggle('show', visible);
  }

  function setFieldError(input, hasError) {
    input.classList.toggle('error', hasError);
  }

  function validateId() {
    var val = idInput.value.trim();
    var valid = /^\d{4}-\d{5}$/.test(val);
    var empty = val.length === 0;
    document.getElementById('err-id').textContent = empty
      ? 'Student ID number is required'
      : 'Format must be YYYY-NNNNN (e.g. 2024-00123)';
    showErr('err-id', !valid);
    setFieldError(idInput, !valid);
    return valid;
  }

  function validateComponent() {
    var valid = componentSelect.value !== '';
    showErr('err-component', !valid);
    setFieldError(componentSelect, !valid);
    return valid;
  }

  function validateYear() {
    var valid = yearSelect.value !== '';
    showErr('err-year', !valid);
    setFieldError(yearSelect, !valid);
    return valid;
  }

  function validateDate() {
    var valid = dateInput.value !== '';
    showErr('err-date', !valid);
    setFieldError(dateInput, !valid);
    return valid;
  }

  function validatePass() {
    var valid = passInput.value.length >= 8;
    showErr('err-pass', !valid);
    setFieldError(passInput, !valid);
    return valid;
  }

  function validatePass2() {
    var valid = pass2Input.value === passInput.value && pass2Input.value.length > 0;
    showErr('err-pass2', !valid);
    setFieldError(pass2Input, !valid);
    return valid;
  }

  idInput.addEventListener('blur', validateId);
  componentSelect.addEventListener('change', validateComponent);
  yearSelect.addEventListener('change', validateYear);
  dateInput.addEventListener('change', validateDate);
  passInput.addEventListener('blur', validatePass);
  pass2Input.addEventListener('blur', validatePass2);

  function simpleHash(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return 'h' + Math.abs(hash).toString(16) + btoa(str).split('').reverse().join('');
  }

  submitBtn.addEventListener('click', function () {
    successMsg.classList.remove('show');

    var idOk = validateId();
    var componentOk = validateComponent();
    var yearOk = validateYear();
    var dateOk = validateDate();
    var passOk = validatePass();
    var pass2Ok = validatePass2();

    if (idOk && componentOk && yearOk && dateOk && passOk && pass2Ok) {
      var account = {
        username: idInput.value.trim(),
        studentId: idInput.value.trim(),
        component: componentSelect.value,
        schoolYear: yearSelect.value,
        registrationDate: dateInput.value,
        passwordHash: simpleHash(passInput.value),
        createdAt: new Date().toISOString()
      };

      var accounts = [];
      try {
        var stored = window.localStorage.getItem('asu_nstp_accounts');
        if (stored) accounts = JSON.parse(stored);
      } catch (e) {
        accounts = [];
      }

      var duplicate = accounts.some(function (a) {
        return a.studentId === account.studentId;
      });

      if (duplicate) {
        document.getElementById('err-id').textContent = 'An account with this Student ID already exists';
        showErr('err-id', true);
        setFieldError(idInput, true);
        return;
      }

      accounts.push(account);

      try {
        window.localStorage.setItem('asu_nstp_accounts', JSON.stringify(accounts));
      } catch (e) {
        console.warn('Could not persist account to localStorage', e);
      }

      successMsg.classList.add('show');
      submitBtn.textContent = 'Account created';
      submitBtn.disabled = true;
    }
  })
})
();
