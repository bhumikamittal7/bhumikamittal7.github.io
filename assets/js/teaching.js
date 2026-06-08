document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.teaching-filter .tab-button');
    const items = document.querySelectorAll('.teaching-item[data-type]');

    if (!filterButtons.length || !items.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;
            items.forEach(item => {
                item.classList.toggle('is-hidden', filter !== 'all' && item.dataset.type !== filter);
            });
        });
    });
});
