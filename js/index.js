document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('.form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log(data)

        axios.post('http://localhost:5000/submit-form', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log('Ответ сервера: ', response);
                alert('Форма успешно отправлена')
            })
            .catch(error => {
                console.error('Ошибка при отправке данных: ', error);
                alert(('Ошибка при отправке данных: ', error))
            });
    });
});