// Handle abstract button clicks
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const abstractButtons = document.querySelectorAll('a.abstract');
        
        abstractButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                // Only prevent default if there's an abstract to show
                const abstractBlock = this.closest('.col-sm-8')?.querySelector('.abstract.hidden');
                if (abstractBlock) {
                    e.preventDefault();
                    abstractBlock.classList.toggle('open');
                    
                    // Close bibtex if open
                    const bibtexBlock = this.closest('.col-sm-8')?.querySelector('.bibtex.hidden.open');
                    if (bibtexBlock) {
                        bibtexBlock.classList.remove('open');
                    }
                }
            });
        });
        
        // Handle bibtex button clicks
        const bibtexButtons = document.querySelectorAll('a.bibtex');
        bibtexButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const bibtexBlock = this.closest('.col-sm-8')?.querySelector('.bibtex.hidden');
                if (bibtexBlock) {
                    bibtexBlock.classList.toggle('open');
                    
                    // Close abstract if open
                    const abstractBlock = this.closest('.col-sm-8')?.querySelector('.abstract.hidden.open');
                    if (abstractBlock) {
                        abstractBlock.classList.remove('open');
                    }
                }
            });
        });
    });
})();

