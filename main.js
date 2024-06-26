$(document).ready(function() {
    $('#donate-button').click(function() {
        const amount = $('input[name="amount"]:checked').val();
        const recurring = $('#recurring').is(':checked');
        const email = $('#email').val();
        const phone = $('#phone').val();
        const name = $('#name').val();
        const comment = $('#comment').val();

        var widget = new cp.CloudPayments();

        // Запуск виджета для одноразовой оплаты или создания рекуррентной подписки
        widget.pay('auth', { // или 'charge'
            publicId: 'pk_aff17de359b486f45c12b4e4fdab0', // id из личного кабинета
            description: 'Пожертвование в благотворительный фонд "Дети в Лете"', // назначение
            amount: parseFloat(amount), // сумма
            currency: 'RUB', // валюта
            accountId: email, // идентификатор плательщика (необязательно)
            skin: "mini", // дизайн виджета (необязательно)
            data: {
                phone: phone,
                name: name,
                comment: comment
            }
        }, {
            onSuccess: function(options) { // success
                if (recurring) {
                    // Если активирован чекбокс ежемесячного платежа, создаем подписку
                    widget.subscription({
                        publicId: 'pk_aff17de359b486f45c12b4e4fdab0',
                        description: 'Ежемесячное пожертвование в благотворительный фонд "Дети в Лете"',
                        amount: parseFloat(amount),
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
