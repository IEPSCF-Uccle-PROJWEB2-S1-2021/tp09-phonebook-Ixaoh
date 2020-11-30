const REQUEST_TIMEOUT = 2000; // ms

const phoneTable = document.getElementById('phone-table');
const phoneTableBody = phoneTable.getElementsByTagName('tbody')[0];
const loadingAlert = document.getElementById('loading-alert');
const loadingSpinner = document.getElementById('loading-spinner');

function loadPhones() {
  phoneTable.classList.add('d-none');
  loadingAlert.classList.add('d-none');
  loadingSpinner.classList.remove('d-none');

  const abortController = new AbortController();
  const timer = setTimeout(() => {
    abortController.abort();
  }, REQUEST_TIMEOUT);

  fetch('/api/phones', { signal: abortController.signal })
    .then((response) => response.json())
    .then((json) => {
      phoneTableBody.innerHTML = '';
      const phones = json.phones;
      phones.forEach((phone) => {
        const row = document.createElement('tr');
        const lastNameCol = document.createElement('td');
        lastNameCol.textContent = phone.lastName;
        row.appendChild(lastNameCol);
        const firstNameCol = document.createElement('td');
        firstNameCol.textContent = phone.firstName;
        row.appendChild(firstNameCol);
        const birthDateCol = document.createElement('td');
        birthDateCol.textContent = phone.birthDate;
        row.appendChild(birthDateCol);
        phoneTableBody.appendChild(row);
        const phoneCol = document.createElement('td');
        phoneCol.textContent = phone.phoneNumber;
        row.appendChild(phoneCol);
        phoneTableBody.appendChild(row);
        const emailCol = document.createElement('td');
        emailCol.textContent = phone.emailAddress;
        row.appendChild(emailCol);
        phoneTableBody.appendChild(row);
      });
      phoneTable.classList.remove('d-none');
    })
    .catch((error) => {
      loadingAlert.classList.remove('d-none');
    })
    .finally(() => {
      loadingSpinner.classList.add('d-none');
      clearTimeout(timer);
    });
}

loadPhones();

const phoneForm = document.getElementById('phone-form');
const lastNameInput = document.getElementById('lastNameInput');
const firstNameInput = document.getElementById('firstNameInput');
const phoneNumberInput = document.getElementById('phoneNumberInput');
const birthDateInput = document.getElementById('birthDateInput');
const emailAddressInput = document.getElementById('emailAddressInput');
const sendingFailure = document.getElementById('sending-failure');

function sendForm() {
  lastNameInput.setAttribute('disabled', true);
  firstNameInput.setAttribute('disabled', true);
  phoneNumberInput.setAttribute('disabled', true);
  birthDateInput.setAttribute('disabled', true);
  emailAddressInput.setAttribute('disabled', true);
  const data = {
    lastName: lastNameInput.value,
    firstName: firstNameInput.value,
    birthDate : birthDateInput.value,
    phoneNumber: phoneNumberInput.value,
    emailAddress : emailAddressInput.value,
  };

  const abortController = new AbortController();
  const timer = setTimeout(() => {
    abortController.abort();
  }, REQUEST_TIMEOUT);

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  fetch('/api/phones', {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
    signal: abortController.signal,
  })
    .then((response) => {
      if (response.ok) {
        loadPhones();
        phoneForm.reset();
        phoneForm.classList.remove('was-validated');
        window.scrollTo(0, 0);
      }
    })
    .catch((error) => {
      sendingFailure.classList.remove('d-none');
    })
    .finally(() => {
      lastNameInput.removeAttribute('disabled');
      firstNameInput.removeAttribute('disabled');
      phoneNumberInput.removeAttribute('disabled');
      birthDateInput.removeAttribute('disabled');
      emailAddressInput.removeAttribute('disabled');
      clearTimeout(timer);
    });
}

phoneForm.addEventListener('submit', (event) => {
  sendingFailure.classList.add('d-none');
  event.preventDefault();
  event.stopPropagation();
  if (phoneForm.checkValidity()) {
    sendForm();
  }

  phoneForm.classList.add('was-validated');
});

const refreshButton = document.getElementById('refresh-button');

refreshButton.addEventListener('click', (event) => {
  loadPhones();
});
