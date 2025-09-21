document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    // Máscara de telefone dos EUA
    const phoneInput = form.phone;
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        if (value.length > 10) value = value.slice(0, 10);
        let formatted = '';
        if (value.length > 0) {
            formatted = '(' + value.substring(0, 3);
        }
        if (value.length >= 4) {
            formatted += ') ' + value.substring(3, 6);
        }
        if (value.length >= 7) {
            formatted += '-' + value.substring(6, 10);
        }
        e.target.value = formatted;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que a página recarregue

        // Validação do campo nome: apenas letras e espaços
        const nameValue = form.name.value.trim();
        if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nameValue)) {
            showToast('Name must contain only letters and spaces.', false);
            return;
        }

        // Validação do campo data: maior ou igual a hoje
        const dateValue = form.schedule.value;
        if (dateValue) {
            const selectedDate = new Date(dateValue);
            const today = new Date();
            today.setHours(0,0,0,0); // Zera horas para comparar só data
            if (selectedDate <= today) {
                showToast('Date must be greater than today.', false);
                return;
            }
        }

        // Exibe loader
        const loader = document.getElementById('formLoader');
        loader.style.display = 'block';

        // Coleta os dados do formulário
        const formData = {
            name: nameValue,
            email: form.email.value,
            phone: form.phone.value,
            service: form.service.value,
            schedule: dateValue
        };

        try {
            const response = await fetch('/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            loader.style.display = 'none'; // Esconde loader
            showToast(result.message, result.success);
            if(result.success) form.reset(); // limpa o formulário só se sucesso
        } catch (error) {
            loader.style.display = 'none'; // Esconde loader
            console.error('Erro ao enviar formulário:', error);
            showToast('Error sending form. Please try again.', false);
        }
    });

    // Função para exibir toast
    function showToast(message, success) {
        const toastEl = document.getElementById('liveToast');
        const toastMsg = document.getElementById('toastMessage');
        toastMsg.textContent = message;
        toastEl.classList.remove('bg-primary', 'bg-danger', 'bg-success');
        toastEl.classList.add(success ? 'bg-success' : 'bg-danger');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
});
                                