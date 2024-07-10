numero_lista = -1
lista_fig_img = []
let ultimaTecla = 0
let valor
cor = false
var audio

const canvas = document.getElementById('main')
const ctx = canvas.getContext('2d')

// Funções de entrada (retornam algo)

function ler_numero(msg) {
    let numero;
    while (true) {
        let input = prompt(msg);
        numero = parseInt(input);
        if (!isNaN(numero)) {
            return numero;
        }
        alert("Por favor, insira um número inteiro válido.");
    }
}

function ler_binario(msg) {
    return confirm(msg)
}

function ler() {
    return new Promise(resolve => {
        function handleKeydown(event) {
            if (event.key === "ArrowUp") {
                ultimaTecla = 1;
            } 
            else if (event.key === "ArrowDown") {
                ultimaTecla = 2;
            } 
            else if (event.key === "ArrowRight") {
                ultimaTecla = 3;
            } 
            else if (event.key === "ArrowLeft") {
                ultimaTecla = 4;
            } 
            else if (event.key === "Enter") {
                ultimaTecla = 5;
            } 
            else if (event.key === " " || event.key === "Space") {
                ultimaTecla = 6;
            }

            if (ultimaTecla !== 0) {
                window.removeEventListener("keydown", handleKeydown);
                resolve(ultimaTecla);
                ultimaTecla = 0;
            }
        }

        window.addEventListener("keydown", handleKeydown);
    });
}

function consultar(){
    valor = ultimaTecla;
    ultimaTecla = 0;
    return valor;
}

function criar_imagem(nome_arquivo, x, y){
    numero_lista += 1
    lista_fig_img.push({
        tipo: "imagem",
        x: x,
        y: y,
        src: nome_arquivo,
        width: canvas.width / 2,
        height: canvas.height / 2,
        opacidade: 1.0
    })
    desenhar_imagem(lista_fig_img[numero_lista])
    return numero_lista
}

function aleatorio(min, max){
    return Math.random() * (max - min) + min
}

function criar_figura(tipo, cor, x, y, tamanho) {
    numero_lista += 1
    lista_fig_img.push({
        tipo: tipo,
        cor: cor,
        x: x,
        y: y,
        tamanho: tamanho,
        opacidade: 1.0
    })
    figura = lista_fig_img[numero_lista]
    desenhar_figura(figura)
    return numero_lista
}

function colidiu(ref_1, ref_2){
    if (lista_fig_img.length <= ref_1 || lista_fig_img.length <= ref_2){
        return false
    }
    let fig_1 = lista_fig_img[ref_1];
    let fig_2 = lista_fig_img[ref_2];

    function colisaoQuadradoQuadrado(fig1, fig2) {
        let tamanho_1 = fig1.tamanho;
        let tamanho_2 = fig2.tamanho;
        
        let superior_esquerdo_fig_1 = [fig1.x, fig1.y];
        let inferior_direito_fig_1 = [fig1.x + tamanho_1, fig1.y + tamanho_1];
        
        let superior_esquerdo_fig_2 = [fig2.x, fig2.y];
        let inferior_direito_fig_2 = [fig2.x + tamanho_2, fig2.y + tamanho_2];
        
        return superior_esquerdo_fig_1[0] <= inferior_direito_fig_2[0] && 
               inferior_direito_fig_1[0] >= superior_esquerdo_fig_2[0] && 
               superior_esquerdo_fig_1[1] <= inferior_direito_fig_2[1] && 
               inferior_direito_fig_1[1] >= superior_esquerdo_fig_2[1];
    }

    function colisaoImagemImagem(fig1, fig2) {
        let superior_esquerdo_fig_1 = [fig1.x, fig1.y];
        let inferior_direito_fig_1 = [fig1.x + fig1.width, fig1.y + fig_1.height];

        let superior_esquerdo_fig_2 = [fig2.x, fig2.y];
        let inferior_direito_fig_2 = [fig2.x + fig2.width, fig2.y + fig_2.height];

        return superior_esquerdo_fig_1[0] <= inferior_direito_fig_2[0] && 
               inferior_direito_fig_1[0] >= superior_esquerdo_fig_2[0] && 
               superior_esquerdo_fig_1[1] <= inferior_direito_fig_2[1] && 
               inferior_direito_fig_1[1] >= superior_esquerdo_fig_2[1];
    }

    function colisaoImagemQuadrado(imagem, quadrado) {
        let superior_esquerdo_imagem = [imagem.x, imagem.y];
        let inferior_direito_imagem = [imagem.x + imagem.width, imagem.y + imagem.height];

        let superior_esquerdo_quadrado = [quadrado.x, quadrado.y];
        let inferior_direito_quadrado = [quadrado.x + quadrado.tamanho, quadrado.y + quadrado.tamanho];

        return superior_esquerdo_imagem[0] <= inferior_direito_quadrado[0] && 
               inferior_direito_imagem[0] >= superior_esquerdo_quadrado[0] && 
               superior_esquerdo_imagem[1] <= inferior_direito_quadrado[1] && 
               inferior_direito_imagem[1] >= superior_esquerdo_quadrado[1];
    }

    function colisaoQuadradoCirculo(quadrado, circulo) {
        // Coordenadas dos cantos do quadrado
        let superior_esquerdo_quadrado = {x: quadrado.x, y: quadrado.y};
        let inferior_direito_quadrado = {x: quadrado.x + quadrado.tamanho, y: quadrado.y + quadrado.tamanho};
        
        // Coordenadas do círculo
        let circulo_x = circulo.x;
        let circulo_y = circulo.y;
        let raio = circulo.tamanho;
        
        // Coordenadas do ponto mais próximo do centro do círculo dentro do quadrado
        let ponto_mais_proximo_x = Math.max(superior_esquerdo_quadrado.x, Math.min(circulo_x, inferior_direito_quadrado.x));
        let ponto_mais_proximo_y = Math.max(superior_esquerdo_quadrado.y, Math.min(circulo_y, inferior_direito_quadrado.y));
        
        // Distância entre o centro do círculo e o ponto mais próximo
        let distancia_x = circulo_x - ponto_mais_proximo_x;
        let distancia_y = circulo_y - ponto_mais_proximo_y;
        let distancia = Math.sqrt(distancia_x * distancia_x + distancia_y * distancia_y);
        
        // Verifica se a distância é menor ou igual ao raio do círculo
        return distancia <= raio;
    }

    function colisaoImagemCirculo(imagem, circulo) {
        // Coordenadas dos cantos do quadrado
        let superior_esquerdo_imagem = {x: imagem.x, y: imagem.y};
        let inferior_direito_imagem = {x: imagem.x + imagem.width, y: imagem.y + imagem.height};

        // Coordenadas do círculo
        let circulo_x = circulo.x;
        let circulo_y = circulo.y;
        let raio = circulo.tamanho;

        // Coordenadas do ponto mais próximo do centro do círculo dentro do quadrado
        let ponto_mais_proximo_x = Math.max(superior_esquerdo_imagem.x, Math.min(circulo_x, inferior_direito_imagem.x));
        let ponto_mais_proximo_y = Math.max(superior_esquerdo_imagem.y, Math.min(circulo_y, inferior_direito_imagem.y));

        // Distância entre o centro do círculo e o ponto mais próximo
        let distancia_x = circulo_x - ponto_mais_proximo_x;
        let distancia_y = circulo_y - ponto_mais_proximo_y;
        let distancia = Math.sqrt(distancia_x * distancia_x + distancia_y * distancia_y);
        
        // Verifica se a distância é menor ou igual ao raio do círculo
        return distancia <= raio;
    }

    function colisaoCirculoCirculo(fig1, fig2) {
        let distX = fig1.x - fig2.x;
        let distY = fig1.y - fig2.y;
        let distancia = Math.sqrt(distX * distX + distY * distY);

        return distancia <= (fig1.tamanho + fig2.tamanho);
    }

    if (fig_1.tipo == "quadrado" && fig_2.tipo == "quadrado") {
        return colisaoQuadradoQuadrado(fig_1, fig_2);
    } else if (fig_1.tipo == "quadrado" && fig_2.tipo == "circulo") {
        return colisaoQuadradoCirculo(fig_1, fig_2);
    } else if (fig_1.tipo == "circulo" && fig_2.tipo == "quadrado") {
        return colisaoQuadradoCirculo(fig_2, fig_1);
    } else if (fig_1.tipo == "circulo" && fig_2.tipo == "circulo") {
        return colisaoCirculoCirculo(fig_1, fig_2);
    } else if (fig_1.tipo == "imagem" && fig_2.tipo == "imagem") {
        return colisaoImagemImagem(fig_1, fig_2);
    } else if (fig_1.tipo == "imagem" && fig_2.tipo == "circulo") {
        return colisaoImagemCirculo(fig_1, fig_2);
    } else if (fig_1.tipo == "imagem" && fig_2.tipo == "quadrado") {
        return colisaoImagemQuadrado(fig_1, fig_2);
    } else if (fig_1.tipo == "circulo" && fig_2.tipo == "imagem") {
        return colisaoImagemCirculo(fig_2, fig_1);
    } else if (fig_1.tipo == "quadrado" && fig_2.tipo == "imagem") {
        return colisaoImagemQuadrado(fig_2, fig_1);
    }

    return false;
}

// Funções de saída

function inicializar_com_imagem(src) {
    bg = new Image()
    bg.onload = function() {
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    };
    bg.src = src
}

function inicializar_com_cor(cor_fundo) {
    ctx.fillStyle = cor_fundo; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    cor = cor_fundo;
}

function mover(ref, dx, dy) {
    lista_fig_img[ref].x += dx
    lista_fig_img[ref].y += dy

    limpar()
    if (cor) {
        inicializar_com_cor(cor)
    }
    redesenhar_tudo()

}

function desenhar_figura(figura){
    ctx.globalAlpha = figura.opacidade
    ctx.fillStyle = figura.cor;
    if (figura.tipo == "circulo"){
        ctx.beginPath();
        ctx.arc(figura.x, figura.y, figura.tamanho, 0, 2 * Math.PI)
        ctx.fill();
        ctx.closePath();
    } else if (figura.tipo == "quadrado") {
        ctx.fillRect(figura.x, figura.y, figura.tamanho, figura.tamanho);
    }
}

function desenhar_imagem(imagem) {
    const imagem_na_tela = new Image()
    imagem_na_tela.onload = function() {
        ctx.globalAlpha = imagem.opacidade
        ctx.drawImage(imagem_na_tela, imagem.x, imagem.y, imagem.width, imagem.height);
    };
    imagem_na_tela.src = imagem.src
}

function mostrar(texto) {
    console.log(String(texto))
    document.getElementById("mensagem").textContent = texto;
}

function limpar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function redefinir_figura(ref, tipo, cor, x, y, tamanho) {
    lista_fig_img[ref].tipo = tipo
    lista_fig_img[ref].cor = cor
    lista_fig_img[ref].x = x
    lista_fig_img[ref].y = y
    lista_fig_img[ref].tamanho = tamanho

    redesenhar_tudo()
}

function redefinir_imagem(numero_da_imagem, src, x, y){
    lista_fig_img[numero_da_imagem].src = src
    lista_fig_img[numero_da_imagem].x = x
    lista_fig_img[numero_da_imagem].y = y
    limpar()
    redesenhar_tudo()
    
}

function redesenhar_tudo() {
    for (objeto of lista_fig_img) {
        if (objeto.tipo == "imagem") {
            desenhar_imagem(objeto)
        } else {
            desenhar_figura(objeto)
        }
    }
}

function tocar(src){
    if (audio) {
        audio.pause();
    }
    audio = new Audio(src);
    audio.play();
}

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function destacar(ref) {
    for (let i = 0; i < lista_fig_img.length; i++) {
        if (i != ref) {
            lista_fig_img[i].opacidade = 0.2
        }
    }

    limpar()
    redesenhar_tudo()
    console.log(lista_fig_img)
}

function reverter_destaque() {
    for (let i = 0; i < lista_fig_img.length; i++) {
        lista_fig_img[i].opacidade = 1.0
    }

    limpar()
    redesenhar_tudo()
}


// Leitura de teclas do tapete

window.addEventListener("keydown", event => {
    if (event.key === "ArrowUp") {
        ultimaTecla =1;
    } 
    else if (event.key === "ArrowDown") {
        ultimaTecla =2;
    } 
    else if (event.key === "ArrowRight") {
        ultimaTecla =3;
    } 
    else if (event.key === "ArrowLeft") {
        ultimaTecla =4;
    } 
    else if (event.key === "Enter") {
        ultimaTecla =5;
    } 
    else if (event.key === " " || event.key === "Space") {
        ultimaTecla =6;
    } 
});