$(document).ready(function() {
    $('#donate-button').click(function() {
        const amount = parseFloat($('input[name="amount"]:checked').val());
        const recurring = $('#recurring').is(':checked');
        const email = $('#email').val();
        const phone = $('#phone').val();
        const name = $('#name').val();
        const comment = $('#comment').val();

        var widget = new cp.CloudPayments();

        widget.pay('auth', { // или 'charge'
            publicId: 'pk_aff17de359b486f45c12b4e4fdab0', // id из личного кабинета
            description: 'Пожертвование в благотворительный фонд "Дети в Лете"', // назначение
            amount: amount, // сумма
            currency: 'RUB', // валюта
            accountId: email, // идентификатор плательщика (необязательно)
            skin: "mini", // дизайн виджета (необязательно)
            data: {
                phone: phone,
                name: name,
                comment: comment
            },
            configuration: {
                common: {
                    successRedirectUrl: "http://clvvn.github.io/TestCloud/success", // адрес для перенаправления при успешной оплате
                    failRedirectUrl: "http://clvvn.github.io/TestCloud/fail" // адрес для перенаправления при неуспешной оплате
                }
            }
        }, {
            onSuccess: function(options) { // success
                if (recurring) {
                    widget.pay('auth', { // charge для ежемесячного списания
                        publicId: 'pk_aff17de359b486f45c12b4e4fdab0',
                        description: 'Ежемесячное пожертвование в благотворительный фонд "Дети в Лете"',
                        amount: amount,
                        currency: 'RUB',
                        accountId: email,
                        email: email,
                        data: {
                            phone: phone,
                            name: name,
                            comment: comment
                        }
                    }, {
                        onSuccess: function(subscriptionOptions) {
                            alert('Подписка успешно создана. Спасибо за ваше ежемесячное пожертвование!');
                        },
                        onFail: function(reason, subscriptionOptions) {
                            alert('Ошибка при создании подписки: ' + reason);
                        }
                    });
                } else {
                    alert('Платеж успешно выполнен. Спасибо!');
                }
            },
            onFail: function(reason, options) { // fail
                alert('Ошибка при оплате: ' + reason);
            },
            onComplete: function(paymentResult, options) { // Вызывается как только виджет получает от api.cloudpayments ответ с результатом транзакции.
                // Например вызов вашей аналитики
            }
        });
    });
});
