// src/ts/main.ts

// Declara o AOS como uma variável global (carregado via CDN)
declare var AOS: any;

/**
 * Função de saudação que imprime uma mensagem no console
 * e atualiza o conteúdo do título principal da página.
 * @param name O nome da pessoa a ser saudada.
 */
function greet(name: string): void {
    console.log(`Olá, ${name}! Seu portfólio agora tem TypeScript!`);
}

const GITHUB_USERNAME = "RobertoSilvaDevFullStack"; // Seu nome de usuário do GitHub
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
// Corrigido o nome da variável para portfolioContainer (com 'C' maiúsculo) e o seletor.
const portfolioContainer = document.querySelector('#portfolio .row.row-cols-1') as HTMLElement;

// --- EFEITO DE DIGITAÇÃO ---
// Seleciona o elemento com a classe 'main-title' para aplicar o efeito de digitação
const mainTitleElement = document.querySelector('.main-title') as HTMLElement;
const dynamicText = "Eleve o seu negócio digital a outro nível com um desenvolvedor Full Stack!";
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100; // Velocidade de digitação em milissegundos

/**
 * implementa um efeito de digitação/exclusão em um elemento HTML.
 * @param element O elemento HTML onde o texto será exibido.
 * @param text O texto a ser digitado.
 */
function typeEffect(element: HTMLElement, text: string) {
    if (!element) return; // Garante que o elemento existe

    // Adiciona ou remove a classe do cursor baseado se estamos digitando ou apagando
    if (!isDeleting) {
        element.classList.add('typing-cursor');
    } else {
        // Remover o cursor ao começar a apagar pode ser uma opção visual
        // element.classList.remove('typing-cursor');
    }

    if (isDeleting) {
        // Apagando texto
        element.textContent = text.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Velocidade mais rápida para apagar
    } else {
        // Digitando texto
        element.textContent = text.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // Velocidade normal de digitação
    }

    // Lógica para alternar entre digitar e apagar
    if (!isDeleting && charIndex === text.length) {
        // Terminou de digitar, agora vamos pausar e depois apagar
        typingSpeed = 2000; // Pausa por 2 segundos
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Terminou de apagar, agora vamos pausar e depois digitar novamente
        isDeleting = false; // Começa a digitar novamente
        typingSpeed = 500; // Pequena pausa antes de começar a digitar de novo
    }

    // Chama a função novamente após o tempo de digitação/pausa
    setTimeout(() => typeEffect(element, text), typingSpeed);
}

// Inicia o efeito de digitação no título principal
if (mainTitleElement) {
    mainTitleElement.textContent = ""; // Garante que começa vazio
    typeEffect(mainTitleElement, dynamicText);
}



// Se o elemento com a classe 'main-title' for encontrado, atualizamos seu texto
// const titleElement = document.querySelector('.main-title');
// if (titleElement) {
//     titleElement.textContent = "🚀 Portfólio Turbinado com TypeScript! 🚀";
// }

// Chamamos a função de saudação com seu nome
greet("Roberto Silva");

interface GitHubRepo {
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Busca os repositórios do GitHub e os renderiza na seção de portfólio.
 */
async function fetchAndRenderProjects(): Promise<void> {
    if (!portfolioContainer) {
        console.error("Elemento '#portfolio .row.row-cols-1' não encontrado.");
        return;
    }

    try {
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const repos: GitHubRepo[] = await response.json();

        // Limpa o conteúdo existente do portfólio (se houver cards estáticos)
        portfolioContainer.innerHTML = '';

        // Filtra e ordena os repositórios
        const filteredRepos = repos
            // Corrigido o typo 'incluses' para 'includes' e 'repos' para 'repo' no filtro
            .filter(repo => !repo.name.includes("portfolio_pessoal") && !repo.name.includes("curso"))
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

        // Adiciona uma imagem padrão se não houver uma específica.
        // Crie esta imagem ou use uma que já tenha em 'assets'.
        const DEFAULT_REPO_IMAGE = "./assets/github-repo-placeholder.jpg"; // Certifique-se de ter esta imagem

        // Mapeamento de nomes de repositórios para suas imagens de preview
        // Exemplo de como ajustar, SE OS NOMES NO GITHUB FOREM DIFERENTES
        const projectImageMap: { [key: string]: string } = {
            "Landing_Page_Fer": "./assets/pagina_imobiliaria.jpeg",
            "jogo_adivinhacao": "./assets/pagina_adivinhacao.jpeg",
            "meu-cinema-projeto": "./assets/pagina_cinema.jpeg", // <--- Exemplo: se o repo for 'meu-cinema-projeto'
            "BibliotecaDB": "./assets/bibliotecadb.jpeg",
            "Alura-Play-Video": "./assets/pagina_play.jpeg", // <--- Exemplo: se o repo for 'Alura-Play-Video'
            "Loja-Meteora-Ecommerce": "./assets/loja_meteora.jpeg", // <--- Exemplo: se o repo for 'Loja-Meteora-Ecommerce'
            // Adicione os mapeamentos para 'Newsletter', 'cafeteria', 'projeto cast' aqui, se tiver imagens para eles
            "Newsletter-Project": "./assets/pagina_newsletter.jpeg", // Exemplo
            "Cafe_Website": "./assets/pagina_cafeteria.jpeg", // Exemplo
            "Cast_Project_CSS": "./assets/pagina_projeto_cast.jpeg", // Exemplo
        };

        filteredRepos.forEach(repo => {
            const cardCol = document.createElement('div');
            cardCol.className = 'col';

            const projectLink = repo.homepage && repo.homepage !== "null" ? repo.homepage : repo.html_url;
            const linkText = repo.homepage && repo.homepage !== "null" ? "Ver Projeto" : "Ver Repositório";

            // Lógica para obter a imagem do projeto:
            // Se houver uma imagem mapeada para o nome do repositório, use-a.
            // Caso contrário, use a imagem padrão.
            const projectImageUrl = projectImageMap[repo.name] || DEFAULT_REPO_IMAGE;


            cardCol.innerHTML = `
        <div class="card h-100">
            <img src="${projectImageUrl}" class="card-img-top" alt="Preview do projeto ${repo.name}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${repo.name.replace(/_/g, ' ')}</h5>
                <p class="card-text flex-grow-1">${repo.description || 'Nenhuma descrição disponível.'}</p>
                <a href="${projectLink}" class="btn btn-primary mt-auto" target="_blank" rel="noopener noreferrer">${linkText}</a>
            </div>
        </div>
    `;
            portfolioContainer.appendChild(cardCol);
        });

        filteredRepos.forEach(repo => {
            const cardCol = document.createElement('div');
            cardCol.className = 'col';

            const projectLink = repo.homepage && repo.homepage !== "null" ? repo.homepage : repo.html_url;
            const linkText = repo.homepage && repo.homepage !== "null" ? "Ver Projeto" : "Ver Repositório";

            // Lógica para imagem do projeto (você pode expandir isso depois)
            let projectImageUrl = DEFAULT_REPO_IMAGE;
            // Exemplo: Se você tiver um padrão para imagens de projetos, como 'assets/projeto-nome-do-repo.jpeg'
            // if (repo.name === "Landing_Page_Fer") projectImageUrl = "./assets/pagina_imobiliaria.jpeg";
            // if (repo.name === "jogo_adivinhacao") projectImageUrl = "./assets/pagina_adivinhacao.jpeg";
            // if (repo.name === "meu_cinema") projectImageUrl = "./assets/pagina_cinema.jpeg";
            // if (repo.name === "BibliotecaDB") projectImageUrl = "./assets/bibliotecadb.jpeg";
            // if (repo.name === "AluraPlay") projectImageUrl = "./assets/pagina_play.jpeg";
            // if (repo.name === "Loja_Meteora") projectImageUrl = "./assets/loja_meteora.jpeg";


            cardCol.innerHTML = `
                <div class="card h-100">
                    <img src="${projectImageUrl}" class="card-img-top" alt="Preview do projeto ${repo.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${repo.name.replace(/_/g, ' ')}</h5>
                        <p class="card-text flex-grow-1">${repo.description || 'Nenhuma descrição disponível.'}</p>
                        <a href="${projectLink}" class="btn btn-primary mt-auto" target="_blank" rel="noopener noreferrer">${linkText}</a>
                    </div>
                </div>
            `;
            // Corrigido o nome da variável para portfolioContainer
            portfolioContainer.appendChild(cardCol);
        });

    } catch (error) {
        console.error("Erro ao buscar repositórios do GitHub:", error);
        if (portfolioContainer) {
            portfolioContainer.innerHTML = '<p class="text-danger text-center">Não foi possível carregar os projetos. Tente novamente mais tarde.</p>';
        }
    }
}

// Chama a função para buscar e renderizar os projetos quando a página carregar
fetchAndRenderProjects();

// Inicializa o AOS para animar elementos ao rolar
AOS.init({
    duration: 1000, // Duração padrão da animação em ms
    once: true      // Anima apenas uma vez (quando o elemento entra na tela pela primeira vez)
                    // Mude para false se quiser que a animação aconteça toda vez que entrar na tela
});