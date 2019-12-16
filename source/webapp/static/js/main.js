const baseUrl = 'http://127.0.0.1:8000/api/';

function login() {
    let userName = $('#username_id');
    let userPass = $('#password_id');
    $.ajax({

        url: baseUrl + 'login/',

        method: 'post',

        data: JSON.stringify({username: userName.val(), password: userPass.val()}),

        dataType: 'json',

        contentType: 'application/json',

        success: function (response, status) {
            localStorage.setItem('apiToken', response.token);
            let loginA = $('#login_id');
            loginA.css('display', 'none');
            let logoutA = $('#logout_id');
            logoutA.css('display', 'block');
            $('#staticBackdrop').modal('hide');
            popupChange('Добро пожаловать, пользователь ' + userName.val() + '!!!');
            userName.val('');
            userPass.val('');
            loadQuotes();
        },
        error: function (response, status) {
            console.log('not logged in')
        }

    });
}

function logout() {
    $.ajax({
        url: baseUrl + 'logout/',
        method: 'post',
        dataType: 'json',
        contentType: 'application/json',

        success: function () {
            let loginA = $('#login_id');
            loginA.css('display', 'block');
            let logoutA = $('#logout_id');
            logoutA.css('display', 'none');
            popupChange('Досвидос', 2000);
        },
        error: function () {
            let loginA = $('#login_id');
            loginA.css('display', 'block');
            let logoutA = $('#logout_id');
            logoutA.css('display', 'none');
            popupChange('Досвидос', 2000);
        }
    });
    localStorage.removeItem('apiToken');
    loadQuotes();

}


$(document).ready(function () {
    loadQuotes();
    if (localStorage.getItem('apiToken')) {
        let loginA = $('#login_id');
        loginA.css('display', 'none');
        let logoutA = $('#logout_id');
        logoutA.css('display', 'block');
    }

});

function loadQuotes() {
    let quotesContainer = $('.quotes');
    quotesContainer.text('');
    let autorCred = {};
    if (localStorage.getItem('apiToken')) {
        autorCred['Authorization'] = 'Token ' + localStorage.getItem('apiToken');
        console.log(autorCred['Authorization'])
    }

    $.ajax({
        url: baseUrl + 'quotes/',
        method: 'get',
        dataType: 'json',
        contentType: 'application/json',
        headers: autorCred,

        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                let quote = $(document.createElement('div'));
                quote.addClass('quote');
                quote.append('<strong>Цитата:</strong>'
                    + response[i].text + '<br><strong>Дата создания:</strong>' + response[i].date_create
                    + '<br><strong>Рейтинг:</strong>' + '<span id="rating_id_' + response[i].id + '">' + response[i].rating + '</span>' + '<br>');
                let myForm = $(document.createElement('form'));
                myForm.attr('onsubmit', 'event.preventDefault()');
                let quoteRateUp = $(document.createElement('button'));
                quoteRateUp.text('+');
                quoteRateUp.addClass('btn btn-success');
                quoteRateUp.attr('onclick', "quoteRateUp(" + response[i].id + "," + response[i].rating + ",'plus')");
                myForm.append(quoteRateUp);
                let quoteRateDown = $(document.createElement('button'));
                quoteRateDown.text('-');
                quoteRateDown.addClass('btn btn-warning');
                quoteRateDown.attr('onclick', "quoteRateUp(" + response[i].id + "," + response[i].rating + ",'minus')");
                myForm.append(quoteRateDown);
                let quoteDetails = $(document.createElement('button'));
                quoteDetails.text('Details');
                quoteDetails.addClass('btn btn-info');
                quoteDetails.attr('onclick', "quoteDetails(" + response[i].id + ")");
                myForm.append(quoteDetails);
                if (localStorage.getItem('apiToken')) {
                    let quoteDelete = $(document.createElement('button'));
                    quoteDelete.text('Delete');
                    quoteDelete.addClass('delete_button');
                    quoteDelete.addClass('btn btn-danger');
                    quoteDelete.attr('onclick', "quoteDelete(" + response[i].id + ")");
                    myForm.append(quoteDelete);
                    let quoteChange = $(document.createElement('button'));
                    quoteChange.text('Change');
                    quoteChange.addClass('change_button');
                    quoteChange.addClass('btn btn-warning');
                    quoteChange.attr('onclick', "quoteChangeForm(" + response[i].id + ")");
                    myForm.append(quoteChange);
                }
                quote.append(myForm);
                quote.attr('id', 'quote_id_' + response[i].id);
                quotesContainer.append(quote);
            }
        }
    })
}

function quoteDetails(num) {
    let header = {};
    if (localStorage.getItem('apiToken')) {
        header['Authorization'] = 'Token ' + localStorage.getItem('apiToken')
    }
    $.ajax({
        url: baseUrl + 'quotes/' + num + '/',
        method: 'get',
        dataType: 'json',
        contentType: 'application/json',
        headers: header,

        success: function (response) {
            let myDiv = $('.quotes');
            myDiv.text('');
            let quote = $(document.createElement('div'));
            quote.addClass('quote');
            quote.append('<strong>Автор:</strong>' + response.name + '<br><strong>Цитата:</strong>'
                + response.text + '<br><strong>Почта:</strong>' + response.email
                + '<br><strong>Рейтинг:</strong>' + response.rating + '<br><strong>Статус:</strong>'
                + response.status + '<br><strong>Дата создания:</strong>' + response.date_create + '<br>');
            let quotesBack = $(document.createElement('button'));
            quotesBack.text('Back');
            quotesBack.addClass('btn btn-info');
            quotesBack.attr('onclick', "loadQuotes()");
            quote.append(quotesBack);
            myDiv.append(quote);
        },

    })
}

function quoteDelete(num) {
    $.ajax({
        url: baseUrl + 'quotes/' + num + '/',

        method: 'delete',

        dataType: 'json',

        contentType: 'application/json',
        headers: {'Authorization': 'Token ' + localStorage.getItem('apiToken')},

        success: function () {
            $('#quote_id_' + num).css('display', 'none');
            popupChange('Удалена цитата ', 2000);

        }
    })
}

function quoteRateUp(num, rating, operation) {
    $.ajax({
        url: baseUrl + 'rate/' + num + '/',
        method: 'post',
        data: JSON.stringify({rating: operation}),
        dataType: 'json',
        contentType: 'application/json',

        success: function (response) {
            $('#rating_id_' + num).text(response.new);
            popupChange('Рейтинг изменен', 1000)
        }
    })
}

function popupChange(text, time = 2000) {
    let loginPopup = $('.alert');
    loginPopup.removeClass('show');
    loginPopup.addClass('show');
    loginPopup.text(text);
    setTimeout(
        function () {
            loginPopup.removeClass('show')
        }, time
    )
}

function quoteCreateForm() {
    let myButton = $('#quotesavebutton_id');
    myButton.attr('onclick', 'quoteSave()');
    $('#someid_5').css('display', 'none');
    $('#someid_4').css('display', 'none');
    $('#someid_1').css('display', 'block');
    $('#someid_3').css('display', 'block');
    $('.create-inputs').val('');

}

function quoteChangeForm(num) {
    $.ajax({
        url: baseUrl + 'quotes/' + num + '/',
        method: 'get',
        dataType: 'json',
        contentType: 'application/json',
        headers: {'Authorization': 'Token ' + localStorage.getItem('apiToken')},

        success: function (response) {
            let myButton = $('#quotesavebutton_id');
            myButton.attr('onclick', 'quoteChangeSave(' + num + ')');
            $('#someid_5').css('display', 'block');
            $('#someid_4').css('display', 'block');
            $('#someid_1').css('display', 'none');
            $('#someid_3').css('display', 'none');
            $('#input_name_id').val(response.name);
            $('#quote_input_id').val(response.text);
            $('#rating_input_id').val(response.rating);
            $('#mail_input_id').val(response.email);
            $('#select_id').val(response.status);
            $('#staticBackdrop1').modal('show');
        }
    });
}

function quoteChangeSave(num) {

    $.ajax({
        url: baseUrl + 'quotes/' + num + '/',
        method: 'put',
        data: JSON.stringify({
            name: $('#input_name_id').val(),
            text: $('#quote_input_id').val(),
            email: $('#mail_input_id').val(),
            rating: $('#rating_input_id').val(),
            status: $('#select_id').val()
        }),
        dataType: 'json',
        contentType: 'application/json',
        headers: {'Authorization': 'Token ' + localStorage.getItem('apiToken')},

        success: function () {
            loadQuotes();
            popupChange('Цитата изменена', 1000);
            $('#staticBackdrop1').modal('hide');
            $('.create-inputs').val('');
        }
    })

}

function quoteSave() {
    $.ajax({
        url: baseUrl + 'quotes/',
        method: 'post',
        data: JSON.stringify({
            name: $('#input_name_id').val(),
            text: $('#quote_input_id').val(),
            email: $('#mail_input_id').val(),
            status: 'new'
        }),
        dataType: 'json',
        contentType: 'application/json',

        success: function () {
            loadQuotes();
            popupChange('Цитата создана', 1000);
            $('#staticBackdrop1').modal('hide');

        }
    });
}