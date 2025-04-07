<script src="https://widget.cloudpayments.ru/bundles/cloudpayments.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<script>
$(document).ready(function() {
    // Функция для генерации следующего номера счета (invoiceId)
    function getNextInvoiceId() {
        let currentInvoiceId = localStorage.getItem('currentInvoiceId');
        if (currentInvoiceId === null) {
            currentInvoiceId = 1;
        } else {
            currentInvoiceId = parseInt(currentInvoiceId) + 1;
        }
        localStorage.setItem('currentInvoiceId', currentInvoiceId);
        return currentInvoiceId.toString();
    }

    // Функция перехода на страницу благодарности
    function redirectToThankYouPage() {
        // Здесь можешь вставить логику выбора страницы в зависимости от услуги
        window.location.href = "https://developers.cloudpayments.ru/#parametry";
        window.location.href = "https://developers.cloudpayments.ru";
    }

    // Обработчик кнопки оплаты
    $('#donate-button').click(function() {
        const amount = parseFloat($('input[name="amount"]:checked').val());
        const recurring = $('#recurring').is(':checked');
        const email = $('#email').val();
        const phone = $('#phone').val().replace(/[^0-9]/g, '');
        const name = $('#name').val();
        const comment = $('#comment').val();
        const invoiceId = getNextInvoiceId();

        if (isNaN(amount) || !email || !phone || !name) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        console.log("Запуск CloudPayments виджета с параметрами: ", {
            amount, email, phone, name, comment, recurring, invoiceId
        });

        const widget = new cp.CloudPayments();

        const receipt = {
            Items: [
                {
                    label: 'Пожертвование',
                    price: amount,
                    quantity: 1,
                    amount: amount,
                    vat: 0,
                    method: 0,
                    object: 4,
                }
            ],
            taxationSystem: 0,
            email: email,
            isBso: false,
            amounts: {
                electronic: amount,
                advancePayment: 0.00,
                credit: 0.00,
                provision: 0.00
            }
        };

        const data = {
            firstName: name.split(" ")[1],
            middleName: name.split(" ")[2],
            lastName: name.split(" ")[0],
            phone,
            comment,
            CloudPayments: {
                CustomerReceipt: receipt
            }
        };

        if (recurring) {
            data.CloudPayments.recurrent = {
                interval: 'Month',
                period: 1,
                customerReceipt: receipt
            };
        }

        const payer = {
            phone: phone
        };

        widget.charge({
            publicId: 'pk_aff17de359b486f45c12b4e4fdab0',
            description: 'Пожертвование в благотворительный фонд "Дети в Лете"',
            amount: amount,
            currency: 'RUB',
            accountId: email,
            invoiceId: invoiceId,
            email: email,
            skin: "modern",
            autoClose: 5,
            data: data,
            configuration: {
                common: {
                    successRedirectUrl: "https://developers.cloudpayments.ru/#parametry",
                    failRedirectUrl: "https://your-site.com/fail"
                }
            },
            payer: payer
        },
        function (options) { // onSuccess
            console.log('Успешный платеж: ', options);
            redirectToThankYouPage();
        },
        function (reason, options) { // onFail
            console.log('Ошибка при оплате: ', reason);
            if (reason === 'User has cancelled') {
                alert('Платеж был отменен пользователем.');
            } else {
                alert('Ошибка при оплате: ' + reason);
            }
        },
        function (paymentResult, options) { // onComplete
            console.log('Получен ответ с результатом транзакции: ', paymentResult);
        });
    });
});
</script>

