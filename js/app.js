/**
 * ============================================================================
 * APLICAÇÃO PRINCIPAL
 * Bolão Libertadores 2026
 * ============================================================================
 */


/**
 * ============================================================================
 * ESTADO DA APLICAÇÃO
 * ============================================================================
 */

const App = {

    sessao: null,

    jogos: [],

    palpites: [],

    telaAtual: "login"

};


/**
 * ============================================================================
 * INICIALIZAÇÃO
 * ============================================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "Aplicação iniciada."
        );


        await restaurarSessao();


        document.body.classList.remove(
            "app-inicializando"
        );

    }
);


function iniciarAplicacao() {

    console.log(
        "Aplicação iniciada."
    );


    mostrarTelaLogin();

}

/**
 * ============================================================================
 * CONTROLE DE TELAS
 * ============================================================================
 */

function mostrarTelaLogin() {

    const telaLogin =
        document.getElementById(
            "tela-login"
        );


    const telaPrincipal =
        document.getElementById(
            "tela-principal"
        );


    if (telaLogin) {

        telaLogin.hidden =
            false;

    }


    if (telaPrincipal) {

        telaPrincipal.hidden =
            true;

    }


    App.telaAtual =
        "login";

}

function mostrarTelaPrincipal() {

    const telaLogin =
        document.getElementById(
            "tela-login"
        );


    const telaPrincipal =
        document.getElementById(
            "tela-principal"
        );


    if (telaLogin) {

        telaLogin.hidden =
            true;

    }


    if (telaPrincipal) {

        telaPrincipal.hidden =
            false;

    }


    App.telaAtual =
        "principal";

}

/**
 * ============================================================================
 * LOGIN
 * ============================================================================
 */

async function realizarLogin() {

    const participante =
        document
            .getElementById(
                "login-participante"
            )
            .value
            .trim();


    const senha =
        document
            .getElementById(
                "login-senha"
            )
            .value;


    const mensagem =
        document
            .getElementById(
                "login-mensagem"
            );


    if (
        !participante ||
        !senha
    ) {

        mensagem.textContent =
            "Informe participante e senha.";

        return;

    }


    mensagem.textContent =
        "Autenticando...";


    try {

        const resposta =
            await apiLogin(
                participante,
                senha
            );


        if (
            !resposta ||
            !resposta.success
        ) {

            mensagem.textContent =
                resposta?.message ||
                "Falha ao realizar login.";

            return;

        }


        const sessao = {

            token:
                resposta.data.token,

            participante:
                participante

        };


        localStorage.setItem(

            "bolao_libertadores_session",

            JSON.stringify(
                sessao
            )

        );


        console.log(

            "Sessão salva:",

            sessao

        );


        App.sessao =
            resposta.data;


        console.log(

            "Login realizado:",

            App.sessao

        );


        mostrarTelaPrincipal();

        await carregarDadosAplicacao();


    }

    catch (
        erro
    ) {


        console.error(

            "Erro no login:",

            erro

        );


        mensagem.textContent =

            "Não foi possível conectar ao servidor.";

    }

}

/**
 * ============================================================================
 * LOGOUT
 * ============================================================================
 */

function realizarLogout() {

    console.log(
        "Encerrando sessão..."
    );


    App.sessao =
        null;


    localStorage.removeItem(
        "bolao_libertadores_session"
    );


    mostrarTelaLogin();


    const senha =
        document.getElementById(
            "login-senha"
        );


    if (
        senha
    ) {

        senha.value =
            "";

    }


    console.log(
        "Sessão encerrada."
    );

}
/**
 * ============================================================================
 * EVENTOS DA INTERFACE
 * ============================================================================
 */

document.addEventListener(
    "click",
    function(event) {


        if (
            event.target.id ===
            "btn-login"
        ) {

            realizarLogin();

        }


        if (
            event.target.id ===
            "btn-logout"
        ) {

            realizarLogout();

        }


        if (
            event.target.classList
                .contains(
                    "nav-btn"
                )
        ) {

            alternarSecao(
                event.target.dataset.tela
            );

        }

    }
);

/**
 * ============================================================================
 * NAVEGAÇÃO ENTRE SEÇÕES
 * ============================================================================
 */

function alternarSecao(
    secao
) {


    const secaoJogos =
        document.getElementById(
            "secao-jogos"
        );


    const secaoRanking =
        document.getElementById(
            "secao-ranking"
        );


    const botoes =
        document.querySelectorAll(
            ".nav-btn"
        );


    if (
        secao ===
        "jogos"
    ) {

        secaoJogos.hidden =
            false;


        secaoRanking.hidden =
            true;

    }


    if (
        secao ===
        "ranking"
    ) {

        secaoJogos.hidden =
            true;


        secaoRanking.hidden =
            false;

    }


    botoes.forEach(
        function(botao) {

            botao.classList.toggle(

                "ativo",

                botao.dataset.tela ===
                secao

            );

        }
    );

}
function obterSessao() {

    const dados =
        localStorage.getItem(
            "bolao_libertadores_session"
        );


    if (
        !dados
    ) {

        return null;

    }


    try {

        return JSON.parse(
            dados
        );

    }
    catch (
        erro
    ) {

        console.error(
            "Sessão inválida:",
            erro
        );


        localStorage.removeItem(
            "bolao_libertadores_session"
        );


        return null;

    }

}

async function restaurarSessao() {

    const sessaoSalva =
        localStorage.getItem(
            "bolao_libertadores_session"
        );


    if (
        !sessaoSalva
    ) {

        mostrarTelaLogin();

        return;

    }


    const sessao =
        JSON.parse(
            sessaoSalva
        );


    try {

        const resposta =
            await apiVerificarSessao(
                sessao.token
            );


        if (
            !resposta ||
            !resposta.success
        ) {

            localStorage.removeItem(
                "bolao_libertadores_session"
            );


            mostrarTelaLogin();

            return;

        }


        App.sessao =
            resposta.data;

        console.log(
            "Sessão validada e restaurada:",
            App.sessao
        );


        mostrarTelaPrincipal();

        await carregarDadosAplicacao();

    }
    catch (
        erro
    ) {

        console.error(
            "Erro ao validar sessão:",
            erro
        );


        mostrarTelaLogin();

    }

}

async function carregarDadosAplicacao() {

    console.log(
        "Carregando dados da aplicação..."
    );


    try {

        const respostaJogos =
            await apiListarJogos();


        if (
            !respostaJogos ||
            !respostaJogos.success
        ) {

            console.error(
                "Falha ao carregar jogos:",
                respostaJogos
            );


            return;

        }


        App.jogos =
            respostaJogos.data;


        console.log(
            "Jogos carregados:",
            App.jogos
        );


        const respostaPalpites =
            await apiListarPalpites();


        if (
            !respostaPalpites ||
            !respostaPalpites.success
        ) {

            console.error(
                "Falha ao carregar palpites:",
                respostaPalpites
            );


            return;

        }


        App.palpites =
            respostaPalpites.data;


        console.log(
            "Palpites carregados:",
        App.palpites
        );


        renderizarJogos(
            App.jogos
        );


    }
    catch (
        erro
    ) {

        console.error(
            "Erro ao carregar dados:",
            erro
        );

    }

}

function renderizarJogos(
    jogos
) {

    const container =
        document.getElementById(
            "lista-jogos"
        );

    if (
        !container
    ) {

        console.error(
            "Container lista-jogos não encontrado."
        );


        return;

    }


    container.innerHTML =
        "";


    if (
        !jogos ||
        jogos.length === 0
    ) {

        container.innerHTML =
            "<p>Nenhum jogo encontrado.</p>";


        return;

    }


    jogos.forEach(
        function(
            jogo
        ) {

            console.log(
                "Processando jogo:",
                jogo.jogoId
            );
            const palpite =
                App.palpites.find(
                    function(
                        item
                    ) {

                        return (

                            item.referenciaId ===
                            jogo.jogoId

                        );

                    }
                );
                console.log(
                    "Palpite encontrado para",
                        jogo.jogoId,
                        ":",
                        palpite
                );

            const golsMandante =
                palpite
                    ? palpite.golsMandante
                    : "";


            const golsVisitante =
                palpite
                    ? palpite.golsVisitante
                    : "";


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "card-jogo";


            card.dataset.jogoId =
                jogo.jogoId;


            card.innerHTML = `

                <div
                    class="card-jogo-cabecalho"
                >

                    <span>
                        Jogo ${jogo.jogoNumero}
                    </span>


                    <span>
                        ${jogo.data}
                        •
                        ${jogo.hora}
                    </span>

                </div>


                <div
                    class="card-jogo-confronto"
                >

                    <div
                        class="time"
                    >

                        <span>
                            ${jogo.mandante}
                        </span>


                        <input

                            type="number"

                            min="0"

                            max="20"

                            class="input-gols"

                            data-campo="mandante"

                            value="${golsMandante}"

                        >

                    </div>


                    <div
                        class="time"
                    >

                        <span>
                            ${jogo.visitante}
                        </span>


                        <input

                            type="number"

                            min="0"

                            max="20"

                            class="input-gols"

                            data-campo="visitante"

                            value="${golsVisitante}"

                        >

                    </div>

                </div>


                <button

                    class="btn-salvar-palpite"

                    data-jogo-id="${jogo.jogoId}"

                >

                    Salvar palpite

                </button>

            `;


            container.appendChild(
                card
            );

        }
    );

}
function salvarPalpite(
    jogoId
) {

    const card =
        document.querySelector(

            `.card-jogo[data-jogo-id="${jogoId}"]`

        );


    if (
        !card
    ) {

        console.error(
            "Card do jogo não encontrado:",
            jogoId
        );


        return;

    }


    const inputMandante =
        card.querySelector(

            '[data-campo="mandante"]'

        );


    const inputVisitante =
        card.querySelector(

            '[data-campo="visitante"]'

        );


    const golsMandante =
        inputMandante.value;


    const golsVisitante =
        inputVisitante.value;


    console.log(
        "Salvando palpite:",
        {

            jogoId,

            golsMandante,

            golsVisitante

        }
    );

}
