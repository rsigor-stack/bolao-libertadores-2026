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

    sessao:
        null,

    jogos:
        [],

    confrontos:
        [],

    palpites:
        [],

    telaAtual:
        "login"

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

        App.sessao =
    resposta.data;

    atualizarTitulos();

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

    atualizarTitulos();

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

        console.log(
            "Clique detectado:",
            event.target
        );
        
        if (
            event.target.id ===
            "btn-login"
        ) {

            realizarLogin();

        }

        if (
            event.target.id ===
            "btn-salvar-todos"
        ) {
        
            salvarTodosPalpites();
        
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

        atualizarTitulos();

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


        /*
         * ============================================================
         * CARREGA JOGOS
         * ============================================================
         */

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


        /*
         * ============================================================
         * CARREGA CONFRONTOS
         * ============================================================
         */

        const respostaConfrontos =
            await apiListarConfrontos();


        if (
            !respostaConfrontos ||
            !respostaConfrontos.success
        ) {

            console.error(
                "Falha ao carregar confrontos:",
                respostaConfrontos
            );


            return;

        }


        App.confrontos =
            respostaConfrontos.data;


        console.log(
            "Confrontos carregados:",
            App.confrontos
        );


        /*
         * ============================================================
         * CARREGA PALPITES
         * ============================================================
         */

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


        /*
         * ============================================================
         * RENDERIZA JOGOS
         * ============================================================
         */

        /* renderizarJogos(
        //    App.jogos
        // );
        */
        renderizarConfrontosOitavas();

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

            const card =
                criarCardJogo(
                    jogo
                );


            container.appendChild(
                card
            );

        }
    );

}

function criarCardJogo(
    jogo
) {


    console.log(
        "Processando jogo:",
        jogo.jogoId
    );


    /*
     * ========================================================
     * LOCALIZA PALPITE EXISTENTE
     * ========================================================
     */

    const palpite =
        App.palpites.find(
            function(
                item
            ) {

                return (

                    item.referenciaId ===
                    jogo.jogoId ||

                    item.referenciaID ===
                    jogo.jogoId ||

                    item.ReferenciaID ===
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


    /*
     * ========================================================
     * VALORES INICIAIS
     * ========================================================
     */

    const golsMandante =
        palpite
            ? palpite.GolsMandante
            : "";


    const golsVisitante =
        palpite
            ? palpite.GolsVisitante
            : "";


    /*
     * ========================================================
     * STATUS INICIAL
     * ========================================================
     */

    const statusInicial =
        palpite
            ? "salvo"
            : "vazio";


    const textoStatusInicial =
        palpite
            ? "Palpite salvo"
            : "Palpite não informado";


    /*
     * ========================================================
     * CRIA CARD
     * ========================================================
     */

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

                    value="${golsMandante ?? ""}"

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

                    value="${golsVisitante ?? ""}"

                >

            </div>

        </div>


        <div
            class="status-palpite"
            data-status="${statusInicial}"
        >

            ${textoStatusInicial}

        </div>


        <button

            class="btn-salvar-palpite"

            data-jogo-id="${jogo.jogoId}"

        >

            Salvar palpite

        </button>

    `;


    /*
     * ========================================================
     * LOCALIZA ELEMENTOS
     * ========================================================
     */

    const inputMandante =
        card.querySelector(
            '[data-campo="mandante"]'
        );


    const inputVisitante =
        card.querySelector(
            '[data-campo="visitante"]'
        );


    const status =
        card.querySelector(
            ".status-palpite"
        );


    const botaoSalvar =
        card.querySelector(
            ".btn-salvar-palpite"
        );


    /*
     * ========================================================
     * ATUALIZA STATUS
     * ========================================================
     */

    function atualizarStatus() {


        const valorMandante =
            inputMandante.value;


        const valorVisitante =
            inputVisitante.value;


        /*
         * PALPITE NÃO INFORMADO
         */

        if (

            valorMandante === "" &&

            valorVisitante === ""

        ) {

            status.textContent =
                "Palpite não informado";


            status.dataset.status =
                "vazio";


            return;

        }


        /*
         * PLACAR INCOMPLETO
         */

        if (

            valorMandante === "" ||

            valorVisitante === ""

        ) {

            status.textContent =
                "Placar incompleto";


            status.dataset.status =
                "alterado";


            return;

        }


        /*
         * ALTERAÇÕES NÃO SALVAS
         */

        status.textContent =
            "Alterações não salvas";


        status.dataset.status =
            "alterado";

    }


    /*
     * ========================================================
     * EVENTOS DOS CAMPOS
     * ========================================================
     */

    inputMandante.addEventListener(
        "input",
        function() {
    
            atualizarStatus();
    
            atualizarClassificadoDoConfronto(
                jogo.confrontoId
            );
    
        }
    );
    
    
    inputVisitante.addEventListener(
        "input",
        function() {
    
            atualizarStatus();
    
            atualizarClassificadoDoConfronto(
                jogo.confrontoId
            );
    
        }
    );


    /*
     * ========================================================
     * EVENTO DO BOTÃO
     * ======================================================== */

    botaoSalvar.addEventListener(
        "click",
        function() {


            console.log(
                "Clique detectado no botão:",
                jogo.jogoId
            );


            salvarPalpite(
                jogo.jogoId
            );

        }
    );


    return card;

}

async function salvarPalpite(
    jogoId,
    mostrarMensagem = true
) {

    console.log(
        "Iniciando salvamento:",
        jogoId
    );


    const card =
        document.querySelector(
            `.card-jogo[data-jogo-id="${jogoId}"]`
        );


    const botao =
        card
            ? card.querySelector(
                ".btn-salvar-palpite"
            )
            : null;


    /*
     * ============================================================
     * TRAVA CONTRA DUPLO CLIQUE
     * ============================================================
     */

    if (
        botao &&
        botao.disabled
    ) {

        console.log(
            "Salvamento já em andamento:",
            jogoId
        );


        return;

    }


    if (
        botao
    ) {

        botao.disabled =
            true;

    }


    try {


        /*
         * ========================================================
         * VALIDA CARD
         * ========================================================
         */

        if (
            !card
        ) {

            console.error(
                "Card do jogo não encontrado:",
                jogoId
            );


            return;

        }


        /*
         * ========================================================
         * LOCALIZA CAMPOS DE GOLS
         * ========================================================
         */

        const inputMandante =
            card.querySelector(
                '[data-campo="mandante"]'
            );


        const inputVisitante =
            card.querySelector(
                '[data-campo="visitante"]'
            );


        if (
            !inputMandante ||
            !inputVisitante
        ) {

            console.error(
                "Campos de gols não encontrados."
            );


            return;

        }


        /*
         * ========================================================
         * LÊ PLACAR
         * ========================================================
         */

        const golsMandante =
            inputMandante.value;


        const golsVisitante =
            inputVisitante.value;


        if (
            golsMandante === "" ||
            golsVisitante === ""
        ) {

            alert(
                "Informe o placar completo."
            );


            return;

        }


        /*
         * ========================================================
         * LOCALIZA JOGO
         * ========================================================
         */

        const jogo =
            App.jogos.find(
                function(
                    item
                ) {

                    return (

                        item.jogoId ===
                        jogoId

                    );

                }
            );


        if (
            !jogo
        ) {

            console.error(
                "Jogo não encontrado:",
                jogoId
            );


            return;

        }


        /*
         * ========================================================
         * MONTA DADOS DO PALPITE
         * ========================================================
         */

        const dados = {

            jogoId:
                jogo.jogoId,


            golsMandante:
                Number(
                    golsMandante
                ),


            golsVisitante:
                Number(
                    golsVisitante
                )

        };


        console.log(
            "Dados do palpite:",
            dados
        );


        /*
         * ========================================================
         * ENVIA PARA API
         * ========================================================
         */

        const resposta =
            await apiSalvarPalpite(
                dados
            );


        /*
         * ========================================================
         * TRATA RESPOSTA
         * ========================================================
         */

        if (
            !resposta ||
            !resposta.success
        ) {

            console.error(
                "Falha ao salvar palpite:",
                resposta
            );

            if (
                    mostrarMensagem
                ) {
            
                    alert(
                        resposta?.message ||
                        "Não foi possível salvar o palpite."
                    );
            
                }
            
            
                return false;

        }

/*
 * ============================================================
 * ATUALIZA STATUS VISUAL
 * ============================================================
 */
        
const cardAtualizado =
    document.querySelector(
        `.card-jogo[data-jogo-id="${jogoId}"]`
    );


console.log(
    "Card localizado após salvamento:",
    cardAtualizado
);


if (
    !cardAtualizado
) {

    console.error(
        "Card não encontrado após salvamento:",
        jogoId
    );

}


const status =
    cardAtualizado
        ? cardAtualizado.querySelector(
            ".status-palpite"
        )
        : null;


        console.log(
            "Status localizado:",
            status
        );
        
        
        if (
            !status
        ) {
        
            console.error(
                "Elemento .status-palpite não encontrado:",
                jogoId
            );
        
        }
        
        
        if (
            status
        ) {
        
            status.textContent =
                "Palpite salvo";
        
        
            status.dataset.status =
                "salvo";
        
        
            console.log(
                "Status atualizado com sucesso:",
                jogoId
            );
        
        }  


/*
 * ============================================================
 * SUCESSO
 * ============================================================
 */
        console.log(
            "Palpite salvo com sucesso:",
            resposta
        );


        console.log(
            "Palpite salvo com sucesso:",
            resposta
        );
        
        
        if (
            mostrarMensagem
        ) {
        
            alert(
                "Palpite salvo com sucesso."
            );
        
        }
        return true;

    }


    catch (
        erro
    ) {

        console.error(
            "Erro ao salvar palpite:",
            erro
        );


        if (
            mostrarMensagem
        ) {
        
            alert(
                "Não foi possível salvar o palpite."
            );
        
        }
        
        
        return false;

    }


    finally {


        /*
         * ========================================================
         * LIBERA BOTÃO
         * ========================================================
         */

        if (
            botao
        ) {

            botao.disabled =
                false;

        }

    }

}

function atualizarTitulos() {

    let nome =
        "";


    if (
        App.sessao &&
        App.sessao.participante
    ) {

        nome =
            App.sessao.participante;

    }


    const tituloNavegador =
        document.getElementById(
            "titulo-aplicacao"
        );


    const tituloPagina =
        document.getElementById(
            "titulo-pagina"
        );


    const textoBase =
        "Bolão Libertadores 2026";


    const textoCompleto =
        nome
            ? textoBase +
              " - " +
              nome
            : textoBase;


    if (
        tituloNavegador
    ) {

        document.title =
            textoCompleto;

    }


    if (
        tituloPagina
    ) {

        tituloPagina.textContent =
            textoCompleto;

    }

}
function atualizarStatusPalpite(
    jogoId
) {

    const card =
        document.querySelector(
            `.card-jogo[data-jogo-id="${jogoId}"]`
        );


    if (
        !card
    ) {

        return;

    }


    const status =
        card.querySelector(
            ".status-palpite"
        );


    if (
        !status
    ) {

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


    if (
        !inputMandante ||
        !inputVisitante
    ) {

        return;

    }


    const golsMandante =
        inputMandante.value;


    const golsVisitante =
        inputVisitante.value;


    /*
     * ============================================================
     * PALPITE NÃO INFORMADO
     * ============================================================
     */

    if (
        golsMandante === "" &&
        golsVisitante === ""
    ) {

        status.textContent =
            "Palpite não informado";


        status.dataset.status =
            "vazio";


        return;

    }


    /*
     * ============================================================
     * PALPITE INCOMPLETO
     * ============================================================
     */

    if (
        golsMandante === "" ||
        golsVisitante === ""
    ) {

        status.textContent =
            "Placar incompleto";


        status.dataset.status =
            "alterado";


        return;

    }


    /*
     * ============================================================
     * QUALQUER ALTERAÇÃO
     * ============================================================
     */

    status.textContent =
        "Alterações não salvas";


    status.dataset.status =
        "alterado";

}
async function salvarTodosPalpites() {

    console.log(
        "Iniciando salvamento de todos os palpites."
    );


    const todosOsCards =
        document.querySelectorAll(
            ".card-jogo"
        );


    const cardsAlterados =
        Array.from(
            todosOsCards
        )
        .filter(
            function(card) {

                const status =
                    card.querySelector(
                        ".status-palpite"
                    );


                return (

                    status &&
                    status.dataset.status ===
                    "alterado"

                );

            }
        );


    console.log(
        "Cards com alterações:",
        cardsAlterados.length
    );


    if (
        cardsAlterados.length === 0
    ) {

        alert(
            "Não há palpites alterados para salvar."
        );


        return;

    }


    /*
     * ============================================================
     * MONTA O LOTE
     * ============================================================
     */

    const palpites =
        cardsAlterados.map(
            function(card) {

                const jogoId =
                    card.dataset.jogoId;


                const inputMandante =
                    card.querySelector(
                        '[data-campo="mandante"]'
                    );


                const inputVisitante =
                    card.querySelector(
                        '[data-campo="visitante"]'
                    );


                return {

                    jogoId:
                        jogoId,

                    golsMandante:
                        Number(
                            inputMandante.value
                        ),

                    golsVisitante:
                        Number(
                            inputVisitante.value
                        )

                };

            }
        );


    console.log(
        "Palpites enviados em lote:",
        palpites
    );


    try {


        /*
         * ========================================================
         * UMA ÚNICA REQUISIÇÃO HTTP
         * ========================================================
         */

        const resposta =
            await apiSalvarPalpitesLote(
                palpites
            );


        if (
            !resposta ||
            !resposta.success
        ) {

            console.error(
                "Falha ao salvar lote:",
                resposta
            );


            alert(

                resposta?.message ||

                "Não foi possível salvar os palpites."

            );


            return;

        }


        /*
         * ========================================================
         * ATUALIZA STATUS VISUAL
         * ========================================================
         */

        cardsAlterados.forEach(
            function(card) {

                const status =
                    card.querySelector(
                        ".status-palpite"
                    );


                if (
                    status
                ) {

                    status.textContent =
                        "Palpite salvo";


                    status.dataset.status =
                        "salvo";

                }

            }
        );


        const quantidade =
            resposta.data &&
            resposta.data.quantidade
                ? resposta.data.quantidade
                : palpites.length;


        alert(

            quantidade === 1

                ? "1 palpite salvo com sucesso."

                : `${quantidade} palpites salvos com sucesso.`

        );


        console.log(
            "Processo de salvamento em lote concluído:",
            resposta
        );

    }


    catch (
        erro
    ) {

        console.error(
            "Erro ao salvar lote:",
            erro
        );


        alert(
            "Não foi possível salvar os palpites."
        );

    }

}

function renderizarConfrontosOitavas() {


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


    const confrontos =
        App.confrontos
            .filter(
                function(
                    confronto
                ) {

                    return (

                        confronto.Fase ===
                        "OITAVAS"

                    );

                }
            )
            .sort(
                function(
                    a,
                    b
                ) {

                    return (

                        Number(
                            a.Ordem
                        )

                        -

                        Number(
                            b.Ordem
                        )

                    );

                }
            );


    if (
        confrontos.length === 0
    ) {

        container.innerHTML =
            "<p>Nenhum confronto encontrado.</p>";


        return;

    }


    confrontos.forEach(
        function(
            confronto
        ) {


            /*
             * ====================================================
             * LOCALIZA JOGOS DO CONFRONTO
             * ====================================================
             */

            const jogos =
                App.jogos
                    .filter(
                        function(
                            jogo
                        ) {

                            return (

                                jogo.confrontoId ===
                                confronto.ConfrontoID

                            );

                        }
                    )
                    .sort(
                        function(
                            a,
                            b
                        ) {

                            return (

                                Number(
                                    a.jogoNumero
                                )

                                -

                                Number(
                                    b.jogoNumero
                                )

                            );

                        }
                    );


            /*
             * ====================================================
             * CRIA CARD DO CONFRONTO
             * ====================================================
             */

            const resultadoConfronto =
                determinarClassificadoConfronto(
                    confronto
                );
            
            const cardConfronto =
                document.createElement(
                    "article"
                );


            cardConfronto.className =
                "card-confronto";


            cardConfronto.dataset.confrontoId =
                confronto.ConfrontoID;


            cardConfronto.innerHTML = `

                <div
                    class="card-confronto-cabecalho"
                >

                    <strong>
                        ${confronto.ConfrontoID}
                    </strong>


                    <span>
                        Oitavas de Final
                    </span>

                </div>


                <div
                    class="card-confronto-times"
                >

                    <span>
                        ${confronto.TimeA}
                    </span>


                    <strong>
                        ×
                    </strong>


                    <span>
                        ${confronto.TimeB}
                    </span>

                </div>


                <div
                    class="jogos-confronto"
                >

                </div>


                <div
                    class="classificado-confronto"
                >
                
                    <span>
                        Classificado:
                    </span>
                
                
                    <strong>
                
                        ${
                            resultadoConfronto.classificado
                                ? resultadoConfronto.classificado
                                : resultadoConfronto.empate
                                    ? "Empate — definição pendente"
                                    : "A definir"
                        }
                
                    </strong>
                
                </div>

            `;


            const containerJogos =
                cardConfronto.querySelector(
                    ".jogos-confronto"
                );


            /*
             * ====================================================
             * INSERE OS DOIS JOGOS
             * ====================================================
             */

            jogos.forEach(
                function(
                    jogo
                ) {

                    const cardJogo =
                        criarCardJogo(
                            jogo
                        );


                    containerJogos.appendChild(
                        cardJogo
                    );

                }
            );


            container.appendChild(
                cardConfronto
            );

        }
    );

}
function determinarClassificadoConfronto(
    confronto
) {


    const jogos =
        App.jogos
            .filter(
                function(
                    jogo
                ) {

                    return (

                        jogo.confrontoId ===
                        confronto.ConfrontoID

                    );

                }
            );


    if (
        jogos.length === 0
    ) {

        return {

            classificado:
                null,

            golsTimeA:
                0,

            golsTimeB:
                0,

            completo:
                false

        };

    }


    let golsTimeA =
        0;


    let golsTimeB =
        0;


    let jogosCompletos =
        0;


    jogos.forEach(
        function(
            jogo
        ) {


            const card =
                document.querySelector(
                    `.card-jogo[data-jogo-id="${jogo.jogoId}"]`
                );


            if (
                !card
            ) {

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


            if (

                !inputMandante ||

                !inputVisitante

            ) {

                return;

            }


            const valorMandante =
                inputMandante.value;


            const valorVisitante =
                inputVisitante.value;


            if (

                valorMandante === "" ||

                valorVisitante === ""

            ) {

                return;

            }


            const golsMandante =
                Number(
                    valorMandante
                );


            const golsVisitante =
                Number(
                    valorVisitante
                );


            if (

                isNaN(
                    golsMandante
                )

                ||

                isNaN(
                    golsVisitante
                )

            ) {

                return;

            }


            jogosCompletos++;


            if (
                jogo.mandante ===
                confronto.TimeA
            ) {

                golsTimeA +=
                    golsMandante;


                golsTimeB +=
                    golsVisitante;

            }

            else {

                golsTimeA +=
                    golsVisitante;


                golsTimeB +=
                    golsMandante;

            }

        }
    );


    if (
        jogosCompletos <
        jogos.length
    ) {

        return {

            classificado:
                null,

            golsTimeA:
                golsTimeA,

            golsTimeB:
                golsTimeB,

            completo:
                false

        };

    }


    if (
        golsTimeA >
        golsTimeB
    ) {

        return {

            classificado:
                confronto.TimeA,

            golsTimeA:
                golsTimeA,

            golsTimeB:
                golsTimeB,

            completo:
                true,

            empate:
                false

        };

    }


    if (
        golsTimeB >
        golsTimeA
    ) {

        return {

            classificado:
                confronto.TimeB,

            golsTimeA:
                golsTimeA,

            golsTimeB:
                golsTimeB,

            completo:
                true,

            empate:
                false

        };

    }


    return {

        classificado:
            null,

        golsTimeA:
            golsTimeA,

        golsTimeB:
            golsTimeB,

        completo:
            true,

        empate:
            true

    };

}
function atualizarClassificadoDoConfronto(
    confrontoId
) {


    const confronto =
        App.confrontos.find(
            function(
                item
            ) {

                return (

                    item.ConfrontoID ===
                    confrontoId

                );

            }
        );


    if (
        !confronto
    ) {

        return;

    }


    const resultado =
        determinarClassificadoConfronto(
            confronto
        );


    const cardConfronto =
        document.querySelector(
            `.card-confronto[data-confronto-id="${confrontoId}"]`
        );


    if (
        !cardConfronto
    ) {

        return;

    }


    const elemento =
        cardConfronto.querySelector(
            ".classificado-confronto strong"
        );


    if (
        !elemento
    ) {

        return;

    }


    if (
        resultado.classificado
    ) {

        elemento.textContent =
            resultado.classificado;

        return;

    }


    if (
        resultado.empate
    ) {

        elemento.textContent =
            "Empate — definição pendente";

        return;

    }


    elemento.textContent =
        "A definir";

}
