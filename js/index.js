import config from './config.js';
import lang from './lang.js';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.form');
    const select = document.querySelectorAll('select');
    const languages = ['en', 'ru'];

    select.forEach(select => select.addEventListener('change', function() {
        const lang = select.value;
        location.href = window.location.pathname + '#' + lang;
        location.reload();
    }));

    function changeLanguage() {
        const hash = window.location.hash.substr(1);
        
        if (!languages.includes(hash)) {
            location.href = window.location.pathname + '#ru';
            location.reload();
        };

        select[0].value = hash;

        function replaceTextRecursive(element, translation) {
            if (element.nodeType === Node.TEXT_NODE) {
                const originalText = element.textContent.trim();
                if (originalText) {
                    element.textContent = translation;
                }
            } else if (element.nodeType === Node.ELEMENT_NODE) {
                const childNodes = Array.from(element.childNodes);
                childNodes.forEach(node => {
                    replaceTextRecursive(node, translation);
                });
            }
        };
    
        for (let key in lang) {
            const elem = document.querySelector('.ln-' + key);
    
            if (elem) {
                const translation = lang[key][hash];
                replaceTextRecursive(elem, translation);
            }
        };
    };

    changeLanguage();


    //form sender
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const fileInput = form.querySelector('input[type="file"]');
        //formData.append('chat_id', config.telegramChatId);

        //const data = Object.fromEntries(formData.entries());

        const name = formData.get('username') || '-';
        const email = formData.get('mail') || '-';
        const telegram = formData.get('tg') || '-';
        const projectInfo = formData.get('projectInfo') || '-';

        const message = `📩Новая заявка! \n\nИмя: ${name} \nПочта: ${email} \nТелеграм: ${telegram} \nОписание проекта: ${projectInfo}`;

        if (fileInput.files[0]) {
            formData.append('chat_id', config.telegramChatId);
            formData.append('document', fileInput.files[0]);
            formData.append('caption', message);

            axios.post(`https://api.telegram.org/bot${config.telegramBotToken}/sendDocument`, formData)
                .then(response => {
                    console.log('Ответ сервера: ', response);
                    alert('Форма и файл успешно отправлены');
                })
                .catch(error => {
                    console.error('Ошибка при отправке данных: ', error);
                    alert('Ошибка при отправке данных');
                });
        } else {
            axios.post(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
                chat_id: config.telegramChatId,
                text: message,
                parse_mode: 'HTML'
            })
            .then(response => {
                console.log('Ответ сервера: ', response);
                alert('Форма успешно отправлена');
            })
            .catch(error => {
                console.error('Ошибка при отправке данных: ', error);
                alert('Ошибка при отправке данных');
            });
        }
    });
});