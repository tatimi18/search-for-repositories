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

async function postForm(event) {
    event.preventDefault();
    
    if (!isValid(this)) {
        return;
    } else {
        const name = Object.fromEntries(new FormData(event.target))
        const response = await fetch(`https://api.github.com/search/repositories?q=${name.repositoryName}&per_page=10`);
        
        if (response.ok) {

            clearList();

            const title = document.querySelector('h3');
            title.innerHTML = `Найденные репозитории по запросу <span class='span-title'>${name.repositoryName}</span>:`
        
            const data = await response.json();
            createRepositoriesList(data);

        } else {
            alert('ошибка')
        };

        clearForm(this);
    };
};

function isValid(form) {
    let errors = document.querySelectorAll('.error')

    let invalidInputs = form.querySelectorAll('.invalid');

    if (errors.length != 0 || invalidInputs.length != 0) {
        return false;
    } else {
        return true;
    };
};

function clearList() {
    const listWrappers = document.querySelectorAll('.list__wrapper');
    for (let listWrapper of listWrappers) {
        listWrapper.remove()
    };
};

function createRepositoriesList(repositoriesData) {
    const result = document.querySelector('.result');

    if (!repositoriesData.total_count) {
        result.innerHTML = 'Ничего не нашлось :(';
    } else {
        result.innerHTML = '';

        const listWrapper = document.createElement('div');
        listWrapper.className = 'list__wrapper';

        const ol = document.createElement('ol');
        ol.className = 'list__ol';
    
        result.after(listWrapper);
        listWrapper.append(ol);

        let repositories = repositoriesData.items;
    
        for (let repository of repositories) {
            let li = document.createElement('li');
            li.className = 'list__li';
    
            let description = repository.description;
    
            if (!description) {
                description = 'Нет описания';
            };

            let userAvatar = repository.owner.avatar_url;
            if (!userAvatar) {
                userAvatar = 'https://pngimg.com/uploads/github/github_PNG88.png';
            };

            li.innerHTML = `
                <a target="_blank" href="${repository.svn_url}" class="list__link">${repository.name}</a>
                <div class="pt10 list__full-name"><span class="span__fish">Полное название:</span> ${repository.full_name}</div>
                <img class="list__img" src="${userAvatar}">
                <div class="pt10 list__author"><span class="span__fish">Автор:</span> ${repository.owner.login}</div>
                <div class="pt10 list__descr"><span class="span__fish">Описание:</span> ${description}</div>
            `;
            ol.append(li);
        };
    };
};

function clearForm(form) {
    let elements = form.elements;
    for (let element of elements) {
        element.value = '';
    };
};




