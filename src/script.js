let form = document.forms.form;

form.addEventListener('click', function(event) {
    let target = event.target;
    
    if (target.className.includes('search')) {
        target.onblur = function() {
            return validate(target, target.value, target.value.length);
        };

        target.onfocus = function() {
            return removeError(target);
        };
    };
});

form.addEventListener('submit', postForm);

function validate(elem, value, lengtn) {
    let error = document.createElement('div');
    error.className = 'error';

    if (!value) {
        elem.classList.add('invalid');
        
        error.innerHTML = 'Заполните это поле';
        elem.after(error);
    } else if (lengtn < 2) {
        elem.classList.add('invalid');
        
        error.innerHTML = 'Введите хотя бы 2 символа';
        elem.after(error);
    }; 
};

function removeError(elem) {
    if (elem.classList.contains('invalid')) {
        let error = elem.nextSibling;
        elem.classList.remove('invalid');
        error.remove();
    };
};

function postForm(event) {
    //отменили действие браузера по умолчанию
    event.preventDefault();
    
    if (!isValid(this)) {
        return;
    } else {
        console.log('запрос');
    };
};

function isValid(form) {
    let errors = document.querySelectorAll('.error')

    let invalidInputs = form.querySelectorAll('.invalid');

    if (errors.length != 0 || invalidInputs.length != 0) {
        //проверка не пройдена
        return false;
    } else {
        //проверка пройдена
        return true;
    };
};

