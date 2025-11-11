// Copy BibTeX to clipboard functionality
(function() {
    function decodeHtmlEntities(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        const copyBibtexButtons = document.querySelectorAll('.copy-bibtex');
        
        copyBibtexButtons.forEach(function(button) {
            button.addEventListener('click', async function() {
                let bibtex = this.getAttribute('data-bibtex');
                
                if (!bibtex) {
                    // Try to get BibTeX from hidden bibtex block
                    const bibtexBlock = this.closest('.col-sm-8')?.querySelector('.bibtex.hidden');
                    if (bibtexBlock) {
                        const codeBlock = bibtexBlock.querySelector('code');
                        if (codeBlock) {
                            bibtex = codeBlock.textContent || codeBlock.innerText;
                        }
                    }
                }
                
                if (bibtex) {
                    // Decode HTML entities
                    bibtex = decodeHtmlEntities(bibtex);
                    
                    try {
                        // Use modern Clipboard API if available
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(bibtex);
                        } else {
                            // Fallback for older browsers
                            const textarea = document.createElement('textarea');
                            textarea.value = bibtex;
                            textarea.style.position = 'fixed';
                            textarea.style.opacity = '0';
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                        }
                        
                        const originalText = button.textContent;
                        button.textContent = 'Copied!';
                        button.style.color = 'var(--link-hover)';
                        
                        setTimeout(function() {
                            button.textContent = originalText;
                            button.style.color = '';
                        }, 2000);
                    } catch (err) {
                        console.error('Failed to copy BibTeX:', err);
                        button.textContent = 'Failed';
                        setTimeout(function() {
                            button.textContent = 'Copy BibTeX';
                        }, 2000);
                    }
                } else {
                    button.textContent = 'No BibTeX';
                    setTimeout(function() {
                        button.textContent = 'Copy BibTeX';
                    }, 2000);
                }
            });
        });
    });
})();

