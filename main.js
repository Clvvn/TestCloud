$(document).ready(function() {
    $('#donate-button').click(function() {
        const amount = parseFloat($('input[name="amount"]:checked').val());
        const recurring = $('#recurring').is(':checked');
        const email = $('#email').val();
        const phone = $('#phone').val();
        const name = $('#name').val();
        const comment = $('#comment').val();

        if (isNaN(amount) || !email || !phone || !name) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        console.log("Запуск CloudPayments виджета с параметрами: ", {
            amount, email, phone, name, comment, recurring
        });

        var widget = new cp.CloudPayments();
        
        var receipt = {
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
            phone: phone,
            isBso: false,
            amounts: {
                electronic: amount,
                advancePayment: 0.00,
                credit: 0.00,
                provision: 0.00
            }
        };

        var data = {};
        if (recurring) {
            data.CloudPayments = {
                CustomerReceipt: receipt,
                recurrent: {
                    interval: 'Month',
                    period: 1,
                    customerReceipt: receipt
                }
            };
        } else {
            data.CloudPayments = {
                CustomerReceipt: receipt
            };
        }

        // Добавляем комментарий 
        if (comment) {
            data.CloudPayments.CustomerReceipt.Items.push({
                label: 'Благодарим за Подертвование!: ' ,
                amount: amount,
                quantity: 1,
                price: amount,
                vat: 0,
                method: 0,
                object: 4,
            });
        }

        widget.charge({
            publicId: 'pk_aff17de359b486f45c12b4e4fdab0',
            description: 'Пожертвование в благотворительный фонд "Дети в Лете"',
            amount: amount,
            currency: 'RUB',
            invoiceId: '1234567',
            accountId: email,
            data: data
        },
        function (options) { // success
            console.log('Успешный платеж: ', options);
            if (recurring) {
                alert('Подписка успешно создана. Спасибо за ваше ежемесячное пожертвование!');
            } else {
                alert('Платеж успешно выполнен. Спасибо!');
            }
        },
        function (reason, options) { // fail
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
