import config from './config.js';

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('.form');
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