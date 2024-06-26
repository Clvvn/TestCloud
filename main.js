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

        widget.pay('auth', { // или 'charge'
            publicId: 'test_api_00000000000000000000002', // id из личного кабинета
            description: 'Пожертвование в благотворительный фонд "Дети в Лете"', // назначение
            amount: amount, // сумма
            currency: 'RUB', // валюта
            invoiceId: '1234567', // номер заказа (необязательно)
            accountId: email, // идентификатор плательщика (необязательно)
            skin: "mini", // дизайн виджета (необязательно)
            data: {
                phone: phone,
                name: name,
                comment: comment,
                myProp: 'myProp value'
            },
            configuration: {
                common: {
                    successRedirectUrl: "http://clvvn.github.io/TestCloud/success", // адрес для перенаправления при успешной оплате
                    failRedirectUrl: "http://clvvn.github.io/TestCloud/fail" // адрес для перенаправления при неуспешной оплате
                }
            }
        }, {
            onSuccess: function(options) { // success
                console.log('Успешный платеж: ', options);
                if (recurring) {
                    widget.subscription({
                        publicId: 'test_api_00000000000000000000002',
                        description: 'Ежемесячное пожертвование в благотворительный фонд "Дети в Лете"',
                        amount: amount,
                        currency: 'RUB',
                        accountId: email,
                        email: email,
                        period: 'Month',
                        interval: 1,
                        startDate: new Date().toISOString().split('T')[0], // Начало подписки с сегодняшнего дня
                        data: {
                            phone: phone,
                            name: name,
                            comment: comment
                        }
                    }, {
                        onSuccess: function(subscriptionOptions) {
                            console.log('Успешная подписка: ', subscriptionOptions);
                            alert('Подписка успешно создана. Спасибо за ваше ежемесячное пожертвование!');
                        },
                        onFail: function(reason, subscriptionOptions) {
                            console.log('Ошибка при создании подписки: ', reason);
                            alert('Ошибка при создании подписки: ' + reason);
                        }
                    });
                } else {
                    alert('Платеж успешно выполнен. Спасибо!');
                }
            },
            onFail: function(reason, options) { // fail
                console.log('Ошибка при оплате: ', reason);
                if (reason === 'User has cancelled') {
                    alert('Платеж был отменен пользователем.');
                } else {
                    alert('Ошибка при оплате: ' + reason);
                }
            },
            onComplete: function(paymentResult, options) { // Вызывается как только виджет получает от api.cloudpayments ответ с результатом транзакции.
                console.log('Транзакция завершена: ', paymentResult);
                // Например вызов вашей аналитики
            }
        });
    });
});
