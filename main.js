$(document).ready(function() {
    // Функция для получения и увеличения invoiceId
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

    $('#donate-button').click(function() {
        const amount = parseFloat($('input[name="amount"]:checked').val());
        const recurring = $('#recurring').is(':checked');
        const email = $('#email').val();
        const phone = $('#phone').val().replace(/[^0-9]/g, ''); // Удаляем все нецифровые символы
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
            //phone: phone,
            isBso: false,
            amounts: {
                electronic: amount,
                advancePayment: 0.00,
                credit: 0.00,
                provision: 0.00
            }
        };

        var data = {
            firstName: name.split(" ")[1] ,
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

        // Добавляем комментарий в чек, если он указан
    //    if (comment) {
    //         receipt.Items.push({
    //             label: 'Комментарий: ' + comment,
    //             amount: 0,
    //             quantity: 1,
    //             price: 0,
    //             vat: 0,
    //             method: 0,
    //             object: 4,
    //         });
    //  }

        // Формируем объект payer
        var payer = {
        
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
            skin: "mini",
            autoClose: 3,
            data: data,
            configuration: {
                common: {
                    successRedirectUrl: "https://your-site.com/success", 
                    failRedirectUrl: "https://your-site.com/fail" 
                }
            },
            payer: payer 
          
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
