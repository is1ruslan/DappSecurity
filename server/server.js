require('dotenv').config();
const config = require('./config')
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const FormData = require('form-data');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

// const botToken = process.env.TELEGRAM_BOT_TOKEN;
// const chatId = process.env.TELEGRAM_CHAT_ID;
const botToken = config.telegramBotToken;
const chatId = config.telegramChatId;
const apiUrl = `https://api.telegram.org/bot${botToken}/sendDocument`;
const sendMessageUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

app.use(cors({ origin: 'http://localhost:8000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/submit-form', upload.single('attach'), (req, res) => {
    const formData = req.body;
    console.log('Данные получены: ', formData)
    const message = `Новая заявка! \nИмя: ${formData.username || '-'} \nПочта: ${formData.mail || '-'} \nТелеграм: ${formData.tg || '-'} \nОписание проекта: ${formData.projectInfo || '-'}`;

    if (req.file) {
        const form = new FormData();
        form.append('chat_id', chatId);
        form.append('document', fs.createReadStream(req.file.path), {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });
        form.append('caption', message);

        axios.post(apiUrl, form, {
            headers: form.getHeaders()
        })
        .then(response => {
            res.send('Форма и файл успешно отправлены');
        })
        .catch(error => {
            res.status(500).send('Ошибка при отправке формы и файла: ', error.message);
            console.log('Ошибка при отправке формы и файла: ', error);
        });
    } else {
        axios.post(sendMessageUrl, {
            chat_id: chatId,
            text: message
        })
        .then(response => {
            res.send('Форма успешно отправлена');
        })
        .catch(error => {
            res.status(500).send('Ошибка при отправке формы: ', error.message);
            console.log('Ошибка при отправке формы: ', error);
        });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});