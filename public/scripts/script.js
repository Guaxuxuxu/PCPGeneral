document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que a página recarregue

        // Exibe loader
        const loader = document.getElementById('formLoader');
        loader.style.display = 'block';

        // Coleta os dados do formulário
        const formData = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            service: form.service.value,
            schedule: form.schedule.value
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
                                