// Função para ser executada quando o documento HTML estiver completamente carregado
$(document).ready(function () {
    // Define 'all' como o filtro ativo inicial
    $('.filter-item[data-filter="all"]').addClass('active-filter');

    // Adiciona um evento de clique a todos os elementos com a classe 'filter-item'
    $('.filter-item').click(function () {
        // Mostra o filtro ativo no botão
        $(this).addClass('active-filter').siblings().removeClass('active-filter');

        // Obtém o valor do atributo 'data-filter'
        const value = $(this).attr('data-filter');

        // Mostra ou esconde as caixas de postagem com base no filtro selecionado
        if (value === 'all') {
            $('.post-box').show('1000');
        } else {
            $('.post-box')
                .hide('1000')
                .filter('.' + value).show('1000');
        }
    });
});

// Função assíncrona para buscar dados JSON de um arquivo
async function fetchNewsData() {
    const response = await fetch('news.json');
    return await response.json();
}

// Função para gerar HTML para um item de notícia
function generateNewsHTML(newsItem) {
    // Cria e retorna a estrutura HTML para um item de notícia
    return `
      <div class="post-box ${newsItem.div.class}" onclick="showPost('${newsItem.id}')">
        <img src="${newsItem.div.children[0].img.src}" alt="${newsItem.div.children[0].img.alt}" class="post-img">
        <h2 class="category">${newsItem.div.children[1].h2.text}</h2>
        <a href="#" class="post-title">${newsItem.div.children[2].a.text}</a>
        <span class="post-date">${newsItem.div.children[3].span.text}</span>
        <p class="post-description">${newsItem.div.children[4].p.text}</p>
        <!-- Perfil -->
        <div class="profile">
            <img src="${newsItem.div.children[5].div.children[0].img.src}" alt="${newsItem.div.children[5].div.children[0].img.alt}" class="profile-img">
            <span class="profile-name">${newsItem.div.children[5].div.children[1].span.text}</span>
        </div>
      </div>
    `;
}

// Função para adicionar itens de notícias ao contêiner
async function appendNewsToContainer(containerId) {
    const container = document.getElementById(containerId);
    const jsonData = await fetchNewsData();

    jsonData.news.forEach(newsItem => {
        const newsHTML = generateNewsHTML(newsItem);
        container.innerHTML += newsHTML;
    });
}

// Função para redirecionar para a página de post com informações específicas
function showPost(postId) {
    window.location.href = `post.html?id=${postId}`;
}

// Chama a função para adicionar itens de notícias ao contêiner
appendNewsToContainer('news-container');

///////////////////////////////////////////////

// Adiciona um Event Listener para o formulário de pesquisa
document.getElementById('searchForm').addEventListener('submit', async function (event) {
    // Obtém o termo de pesquisa do input de pesquisa
    const searchTerm = document.getElementById('searchInput').value;

    // Redireciona para a página de pesquisa com o termo de pesquisa como parâmetro
    window.location.href = `search.html?searchTerm=${encodeURIComponent(searchTerm)}`;

    event.preventDefault(); // Prevent the default form submission behavior
});

// Na página de search.html, recupera o termo de pesquisa do parâmetro da consulta
const searchTerm = new URLSearchParams(window.location.search).get('searchTerm');

// Busca dados JSON do arquivo news.json
fetch('news.json')
    .then(response => response.json())
    .then(jsonData => {
        // Chama a função para buscar notícias com base no termo de pesquisa
        buscarNoticias(searchTerm, jsonData);
    });

function buscarNoticias(searchTerm, jsonData) {
    // Lógica para buscar e exibir notícias com base no termo de pesquisa
    const termoPesquisa = searchTerm.toLowerCase();
    let algumaNoticiaEncontrada = false;

    const noticiasContainer = document.getElementById('noticias');
    noticiasContainer.innerHTML = '';

    jsonData.news.forEach(noticiaData => {
        const titulo = noticiaData.div.children[2].a.text.toLowerCase();

        if (titulo.includes(termoPesquisa)) {
            noticiasContainer.appendChild(criarNoticiaHTML(noticiaData));
            algumaNoticiaEncontrada = true;
        }
    });

    // Exibe mensagem se nenhuma notícia for encontrada
    const mensagemNenhumaNoticia = document.getElementById('mensagemNenhumaNoticia');
    mensagemNenhumaNoticia.style.display = algumaNoticiaEncontrada ? 'none' : 'block';
}

function criarNoticiaHTML(noticiaData) {
    // Lógica para criar elementos HTML com base nos dados JSON

    const noticia = noticiaData.div;

    let postBox = document.createElement('div');
    postBox.classList.add(...noticia.class.split(' '));

    let postImg = document.createElement('img');
    postImg.src = noticia.children[0].img.src;
    postImg.alt = noticia.children[0].img.alt;
    postImg.classList.add(noticia.children[0].img.class);

    let category = document.createElement('h2');
    category.classList.add(noticia.children[1].h2.class);
    category.textContent = noticia.children[1].h2.text;

    let postTitle = document.createElement('a');
    postTitle.href = noticia.children[2].a.href;
    postTitle.classList.add(noticia.children[2].a.class);
    postTitle.textContent = noticia.children[2].a.text;

    let postDate = document.createElement('span');
    postDate.classList.add(noticia.children[3].span.class);
    postDate.textContent = noticia.children[3].span.text;

    let postDescription = document.createElement('p');
    postDescription.classList.add(noticia.children[4].p.class);
    postDescription.textContent = noticia.children[4].p.text;

    let profile = document.createElement('div');
    profile.classList.add(...noticia.children[5].div.class.split(' '));

    let profileImg = document.createElement('img');
    profileImg.src = noticia.children[5].div.children[0].img.src;
    profileImg.alt = noticia.children[5].div.children[0].img.alt;
    profileImg.classList.add(noticia.children[5].div.children[0].img.class);

    let profileName = document.createElement('span');
    profileName.classList.add(noticia.children[5].div.children[1].span.class);
    profileName.textContent = noticia.children[5].div.children[1].span.text;

    // Adicionar elementos ao postBox e profile
    postBox.appendChild(postImg);
    postBox.appendChild(category);
    postBox.appendChild(postTitle);
    postBox.appendChild(postDate);
    postBox.appendChild(postDescription);

    profile.appendChild(profileImg);
    profile.appendChild(profileName);

    postBox.appendChild(profile);

    return postBox;
}