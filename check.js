// Функция для проверки валидности email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Функция для проверки валидности номера телефона (допускаются только цифры и определенные символы)
function isValidPhoneNumber(phone) {
    const phoneRegex = /^\+?[0-9()-]*$/;
    return phoneRegex.test(phone);
}

// Функция для проверки валидности ФИО (допускаются только буквы, пробелы и дефисы)
function isValidName(name) {
    const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s'-]+$/;
    return nameRegex.test(name);
}

// Функция для динамической проверки полей при вводе
$(document).ready(function() {
    $('#email').on('input', function() {
        const email = $(this).val().trim();
        if (isValidEmail(email)) {
            $(this).closest('.field').removeClass('invalid-input');
        } else {
            $(this).closest('.field').addClass('invalid-input');
        }
    });

    $('#phone').on('input', function() {
        const phone = $(this).val().trim();
        if (isValidPhoneNumber(phone)) {
            $(this).closest('.field').removeClass('invalid-input');
        } else {
            $(this).closest('.field').addClass('invalid-input');
        }
    });

    $('#name').on('input', function() {
        const name = $(this).val().trim();
        if (isValidName(name)) {
            $(this).closest('.field').removeClass('invalid-input');
        } else {
            $(this).closest('.field').addClass('invalid-input');
        }
    });
});

// Динамическая проверка полей перед разблокировкой кнопки
$(document).ready(function() {
    $('#donate-button').prop('disabled', true);

    $('#donation-form input, #donation-form textarea').on('input', function() {
        const email = $('#email').val().trim();
        const phone = $('#phone').val().trim();
        const name = $('#name').val().trim();

        const validEmail = isValidEmail(email);
        const validPhone = isValidPhoneNumber(phone);
        const validName = isValidName(name);

        if (validEmail && validPhone && validName) {
            $('#donate-button').prop('disabled', false);
        } else {
            $('#donate-button').prop('disabled', true);
        }
    });
});
