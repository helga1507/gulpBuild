$(document).ready(function() {
    var $html = $('html');
    var $body = $('body');

    //маска для всех полей с номером телефона
    $("input[name='phone']").mask("+7 (999) 999-9999");

    $('.open-video').click(function () {
        $('#modal-video .modal-title').text($(this).attr('data-title'));
        $('#modal-video iframe').attr('src',$(this).attr('data-video'));
        $('#modal-video').modal();
    });

    //модалка "политика конфиденциальности"
    $modalPrivacy = $('#modal-privacy');

    $('.open-privacy').click(function(e) {
        e.preventDefault();
        $modalPrivacy.modal('show');
    });

    $(".modal").find(".open-privacy").click(function(e) {
        e.preventDefault();
        $modalPrivacy.addClass("open-modal-privacy");
    });
    $modalPrivacy.on("hidden.bs.modal", function() {
        if ($modalPrivacy.hasClass("open-modal-privacy")) {
            $modalPrivacy.removeClass("open-modal-privacy");
            $body.addClass("modal-open");
        }
    });

    //работа checkbox для политики
    $('.check-privacy').find('label').click(function(){
        $(this).parent('.check-privacy').find('input[type=checkbox]').prop( "checked", function(i, prop) {
            return !prop;
        });
    });

    //проверка для полей с номером телефона;
    // если уставливается курсор в строку и до курсора нет символов  "_" - можно редактировать
    //если до курсора есть "_" - курсор переходит к первому такому символу
    $("input[name='phone']").on('click keyup',function () {
        var val = $(this).val();
        var n = val.indexOf('_');
        var str = val.substring(0,getCaretPosition(this).start);

        if(n != '-1' && str.indexOf('_') != -1)  setCaretPosition(this,n);
    });

    //установка позиции каретки
    function setCaretPosition(ctrl, start, end) {
        if (end === undefined) {
            end = start;
        }
        // IE >= 9 and other browsers
        if(ctrl.setSelectionRange)
        {
            ctrl.focus();
            ctrl.setSelectionRange(start, end);
        }
        // IE < 9
        else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    }
    //получение позиции каретки
    function getCaretPosition (ctrl) {
        // IE < 9 Support
        if (document.selection) {
            ctrl.focus();
            var range = document.selection.createRange();
            var rangelen = range.text.length;
            range.moveStart ('character', -ctrl.value.length);
            var start = range.text.length - rangelen;
            return {'start': start, 'end': start + rangelen };
        }
        // IE >=9 and other browsers
        else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
            return {'start': ctrl.selectionStart, 'end': ctrl.selectionEnd };
        } else {
            return {'start': 0, 'end': 0};
        }
    }

    //отправка формы
    $('.order-form').submit(function(e){
        //отменяем отправку формы
        e.preventDefault();
        var order_form = this;
        //если не указан номер телефона - завершаем действие функции
        if($(this).find('input[name="phone"]').length > 0) {
            if ($(this).find('input[name="phone"]').val() == '') {
                alert('Пожалуйста, укажите Ваш номер телефона');
                return false;
            }
        }
        else  {
            if($('input[name="phone"][form="'+$(this).attr('id')+'"]').val() == ''){
                alert('Пожалуйста, укажите Ваш номер телефона');
                return false;
            }
        }

        if($(this).find('input[name="privacy"]').length > 0){
            if(!$(this).find('input[name="privacy"]').prop("checked")) {
                alert('Вам необходимо дать согласие на обработку своих персональных данных.');
                return false;
            }
        }
        else  {
            if(!$('input[name="privacy"][form="'+$(this).attr('id')+'"]').prop("checked")){
                alert('Вам необходимо дать согласие на обработку своих персональных данных.');
                return false;
            }
        }

        var m_method=$(this).attr('method');
        var m_action=$(this).attr('action');
        var m_data=$(this).serialize();
        var ya_kod = $(this).find('input[name="yandex-js"]').val();
        //var google_kod = $(this).find('input[name="google-js"]').val();
        var google_kod = 0;
        if($(this).find('input[name="google-js"]').val() == 'y' && ya_kod)
            google_kod = ya_kod;

        //отправляем форму по обычному action
        $.ajax({
            type: m_method,
            url: m_action,
            data: m_data,
            success: function(result){
                if(ya_kod) yaCounter47214825.reachGoal(ya_kod);
                if(google_kod != 0) ga('send', 'event','Contact Click','Submit',google_kod);
                order_form.reset();
                $('.modal').modal('hide');
                $('#senk').modal('show');
            }
        });
    });
    //для яндекс метрики и гугл аналитики; при открытии попапа "принять участие"
    $('.part-click').click(function () {
        var ya_kod = $(this).attr('data-ya_metrika_submit');
        $('#modal-part').find('[name="yandex-js"]').val(ya_kod);
    });
    //для яндекс метрики и гугл аналитики; при открытии попапа "заказать звонок"
    $('.openzvonok-yandex').click(function () {
        var ya_kod = $(this).attr('data-ya_metrika_submit');
        $('#modal-zvonok').find('[name="yandex-js"]').val(ya_kod);
        $('#modal-zvonok').find('button.btn-default').text($(this).text());
    });


    //для яндекс метрики и гугл аналитики. выполнение события "нажатие на элемент"
    $('*[data-ya_action="click"]').click(function () {
        //берем код для яндес события
        var ya_kod = $(this).attr('data-ya_metrika');
        var google_kod = 0;
        if($(this).attr('data-google') == 'y' && ya_kod)
            google_kod = ya_kod;

        //если пользователь нажимает первый раз, то событие срабатывает (переключатель switch = true)
        if($(this).attr('data-ya_switch') == "true") {
            //отправляем события яндекса
            yaCounter47214825.reachGoal(ya_kod);
            //alert(google_kod);
            if(google_kod != 0) ga('send', 'event','Contact Click','Submit',google_kod);
            //alert(ya_kod);
            //устанавливем переключателю switch значение false, чтобы событие больше не срабатывало
            $('[data-ya_metrika="'+ya_kod+'"]').attr('data-ya_switch','false');
        }
    });


});
//добавление нового класса в верхнее меню при скролле (для его уменьшения)
$(window).scroll(function(){
    if($(document).width() > 970 )
    {

        if ($(this).scrollTop() >= 150) {
            $('header.wr1').addClass('head-fixed');
        }
        else {
            $('header.wr1').removeClass('head-fixed');
        }
    }

});
