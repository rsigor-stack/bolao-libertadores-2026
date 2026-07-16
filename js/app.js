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

    telaAtual: "login"

};


/**
 * ============================================================================
 * INICIALIZAÇÃO
 * ============================================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    iniciarAplicacao
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


        App.sessao =
            resposta.data;


        console.log(
            "Login realizado:",
            App.sessao
        );


        mostrarTelaPrincipal();


    }
    catch (erro) {


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

    App.sessao =
        null;


    mostrarTelaLogin();


    const senha =
        document
            .getElementById(
                "login-senha"
            );


    if (senha) {

        senha.value =
            "";

    }

}
