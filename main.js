$(document).ready(function() {
    $('#donate-button').click(function() {
        const amount = $('input[name="amount"]:checked').val();
        const recurring = $('#recurring').is(':checked');
        const email = $('#email').val();
        const phone = $('#phone').val();
        const name = $('#name').val();
        const comment = $('#comment').val();

        var widget = new cp.CloudPayments({
            language: "ru-RU"
        });

        widget.pay('auth', { // или 'charge'
            publicId: 'pk_aff17de359b486f45c12b4e4fdab0', // id из личного кабинета
            description: 'Пожертвование в благотворительный фонд "Дети в Лете"', // назначение
            amount: amount, // сумма
            currency: 'RUB', // валюта
            accountId: email, // идентификатор плательщика (необязательно)
            skin: "mini", // дизайн виджета (необязательно)
            autoClose: 3, // время в секундах до авто-закрытия виджета (необязательный)
            data: {
                phone: phone,
                name: name,
                comment: comment
            },
            configuration: {
                common: {
                    successRedirectUrl: "http://test.test/success", // адрес для перенаправления при успешной оплате
                    failRedirectUrl: "http://test.test/fail" // адрес для перенаправления при неуспешной оплате
                }
            }
        }, {
            onSuccess: function(options) { // success
                if (recurring) {
                    widget.subscription({
                        publicId: 'pk_aff17de359b486f45c12b4e4fdab0',
                        description: 'Ежемесячное пожертвование в благотворительный фонд "Дети в Лете"',
                        amount: amount,
                        currency: 'RUB',
                        accountId: email,
                        email: email,
                        period: 'Month',
                        interval: 1,
                        startDate: new Date(),
                        data: {
                            phone: phone,
                            name: name,
                            comment: comment
                        }
                    });
                }
                alert('Платеж успешно выполнен. Спасибо!');
            },
            onFail: function(reason, options) { // fail
                if (reason === 'User has cancelled') {
                    alert('Платеж был отменен пользователем.');
                } else {
                    alert('Ошибка при оплате: ' + reason);
                }
            },
            onComplete: function(paymentResult, options) { // Вызывается как только виджет получает от api.cloudpayments ответ с результатом транзакции.
                // Например вызов вашей аналитики Facebook Pixel
            }
        });
    });
});
