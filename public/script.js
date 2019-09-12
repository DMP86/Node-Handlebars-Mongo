document.querySelectorAll('.price1').forEach(node => {
    node.textContent = new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(node.textContent)
})

document.querySelectorAll('.date').forEach(node => {
node.textContent = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(node.textContent))
})

const card = document.querySelector('.cardNode')

if(card) {
    document.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id

            fetch('/card/remove/' + id, {
                method: 'delete'
            }).then (() => window.location.reload())
        }
    })
}

M.Tabs.init(document.querySelectorAll('.tabs'));