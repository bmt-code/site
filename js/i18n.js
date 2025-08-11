document.addEventListener('DOMContentLoaded', () => {

    const supportedLangs = ['pt-BR', 'en', 'es-LA'];
    let translations = {};

    // 1. Função para carregar o arquivo de tradução
    const loadTranslations = async (lang) => {
        console.log(`[i18n] Tentando carregar traduções para: ${lang}`);
        const path = `locales/${lang}.json`;
        console.log(`[i18n] Buscando arquivo em: ${path}`);
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Erro de rede: ${response.status} - ${response.statusText}`);
            }
            translations = await response.json();
            console.log('[i18n] Traduções carregadas com sucesso:', translations);
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Opcional: Carregar um idioma padrão em caso de falha
            if (lang !== 'pt-BR') {
                await loadTranslations('pt-BR');
            }
        }
    };

    // 2. Função para atualizar o conteúdo da página
    const updateContent = () => {
        console.log('[i18n] Atualizando conteúdo da página...');
        document.querySelectorAll('[data-i18n-key]').forEach(element => {
            let key = element.getAttribute('data-i18n-key');
            let attribute = null; // Atributo a ser modificado

            // 1. Verifica se a chave especifica um atributo, ex: [content]meta.description
            const attributeMatch = key.match(/^\[(.*?)\]/);
            if (attributeMatch) {
                attribute = attributeMatch[1]; // Captura 'content'
                key = key.substring(attributeMatch[0].length); // Remove '[content]' da chave
            } else {
                // 2. Se não, define um atributo padrão com base na tag
                switch (element.tagName) {
                    case 'INPUT':
                    case 'TEXTAREA':
                        attribute = 'placeholder';
                        break;
                    default:
                        attribute = 'innerHTML';
                }
            }

            // 3. Acessa chaves aninhadas (ex: "nav.home" ou "meta.description")
            const translation = key.split('.').reduce((obj, part) => obj && obj[part], translations);

            if (translation) {
                // 4. Aplica a tradução ao elemento/atributo correto
                if (attribute === 'innerHTML') {
                    if (element.tagName === 'TITLE') {
                        document.title = translation;
                    } else {
                        element.innerHTML = translation;
                    }
                } else {
                    element.setAttribute(attribute, translation);
                }
            } else {
                console.warn(`[i18n] Chave não encontrada para: ${key}`);
            }
        });
    };

    // 3. Função para definir o idioma
    const setLanguage = async (lang) => {
        console.log(`[i18n] Definindo idioma para: ${lang}`);
        // Salva a preferência do usuário
        localStorage.setItem('lang', lang);
        
        // Define o atributo 'lang' na tag <html> para fins de SEO e acessibilidade
        document.documentElement.lang = lang;

        // Atualiza a classe 'active' nos botões para dar feedback visual
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        await loadTranslations(lang);
        updateContent();
    };

    // 4. Lógica de inicialização
    const init = () => {
        // Detecta o idioma salvo ou o idioma do navegador, com fallback para 'pt-BR'
        const userLang = localStorage.getItem('lang') || navigator.language || 'pt-BR';
        
        console.log(`[i18n] Idioma detectado (usuário/navegador): ${userLang}`);
        // Encontra o idioma suportado mais próximo (ex: 'en-US' se torna 'en')
        const langToSet = supportedLangs.find(lang => userLang.startsWith(lang)) || 'pt-BR';

        setLanguage(langToSet);

        // Adiciona os event listeners para os botões de troca de idioma
        console.log('[i18n] Adicionando listeners aos botões...');
        const langSwitchers = document.querySelectorAll('[data-lang]');
        langSwitchers.forEach(switcher => {
            switcher.addEventListener('click', (event) => {
                const selectedLang = event.currentTarget.getAttribute('data-lang');
                setLanguage(selectedLang);
            });
        });
    };

    // Inicia todo o processo
    console.log('[i18n] Script inicializado.');
    init();

});