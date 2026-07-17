/**
 * ============================================================================
 * API DO BOLÃO
 * Comunicação com o Google Apps Script
 * ============================================================================
 */

const API_URL =
  "https://script.google.com/macros/s/AKfycbzfOEh6mS_Ja3Cy7TYR4J3U1zPmbbFjMzM9mLa0CVGL8pTRIVMeuMph9um_AsqkxJfodw/exec";


/**
 * ============================================================================
 * FUNÇÃO BASE DE COMUNICAÇÃO COM A API
 * ============================================================================
 */

async function apiRequest(
    action,
    options = {}
) {

    const {

        method = "GET",

        body = null,

        params = null

    } = options;


    let url =
        API_URL +
        "?action=" +
        encodeURIComponent(
            action
        );


    if (
        params
    ) {

        Object.keys(
            params
        ).forEach(
            function(
                chave
            ) {

                url +=
                    "&" +
                    encodeURIComponent(
                        chave
                    ) +
                    "=" +
                    encodeURIComponent(
                        params[
                            chave
                        ]
                    );

            }
        );

    }


    const config = {

        method

    };


    console.log(
        "URL:",
        url
    );


    console.log(
        "Método:",
        method
    );


    console.log(
        "Body original:",
        body
    );


    if (
        method === "POST"
    ) {

        config.body =
            new URLSearchParams(
                body
            );

    }


    console.log(
        "Body enviado:",
        config.body
    );


    try {

        const response =
            await fetch(

                url,

                config

            );


        console.log(
            "Resposta HTTP:",
            response.status
        );


        const texto =
            await response.text();


        console.log(
            "Texto recebido:",
            texto
        );


        return JSON.parse(
            texto
        );


    }
    catch (
        erro
    ) {

        console.error(
            "Erro dentro de apiRequest:",
            erro
        );


        throw erro;

    }

}
/**
 * ============================================================================
 * LOGIN
 * ============================================================================
 */

async function apiLogin(
    participante,
    senha
) {

    console.log(
        "1. Iniciando login"
    );


    console.log(
        "2. Dados enviados:",
        {
            participante,
            senha
        }
    );


    try {

        const resultado =
            await apiRequest(

                "login",

                {

                    method: "POST",

                    body: {

                        participante,
                        senha

                    }

                }

            );


        console.log(
            "3. Resposta da API:",
            resultado
        );


        return resultado;


    }
    catch (erro) {

        console.error(
            "4. Erro real:",
            erro
        );


        throw erro;

    }

}

/**
 * ============================================================================
 * LISTAR JOGOS
 * ============================================================================
 */

async function apiListarJogos() {

  return apiRequest(

    "listarJogos"

  );

}


/**
 * ============================================================================
 * LISTAR PALPITES
 * ============================================================================
 */

async function apiListarPalpites(
  participante,
  token
) {

  return apiRequest(

    "listarPalpites",

    {

      method: "POST",

      body: {

        participante,

        token

      }

    }

  );

}


/**
 * ============================================================================
 * SALVAR PALPITE
 * ============================================================================
 */

async function apiSalvarPalpite(
  dados
) {

  return apiRequest(

    "salvarPalpite",

    {

      method: "POST",

      body: dados

    }

  );

}
async function apiVerificarSessao(token) {

    console.log(
        "Verificando sessão..."
    );


    console.log(
        "Token:",
        token
    );


    try {

        const resultado =
            await apiRequest(

                "verificarSessao",

                {

                    method: "GET",

                    params: {

                        token

                    }

                }

            );


        console.log(
            "Resposta da verificação:",
            resultado
        );


        return resultado;


    }
    catch (erro) {

        console.error(
            "Erro ao verificar sessão:",
            erro
        );


        throw erro;

    }

}

async function apiListarJogos() {

    console.log(
        "Carregando jogos..."
    );


    try {

        const resultado =
            await apiRequest(

                "listarJogos",

                {

                    method: "GET"

                }

            );


        console.log(
            "Resposta dos jogos:",
            resultado
        );


        return resultado;

    }
    catch (
        erro
    ) {

        console.error(
            "Erro ao carregar jogos:",
            erro
        );


        throw erro;

    }

}

async function apiListarPalpites() {

    console.log(
        "Carregando palpites..."
    );


    const sessao =
        App.sessao;


    if (
        !sessao ||
        !sessao.token
    ) {

        throw new Error(
            "Sessão não disponível."
        );

    }


    try {

        const resultado =
            await apiRequest(

                "listarPalpites",

                {

                    method: "GET",

                    params: {

                        token:
                            sessao.token

                    }

                }

            );


        console.log(
            "Resposta dos palpites:",
            resultado
        );


        return resultado;

    }
    catch (
        erro
    ) {

        console.error(
            "Erro ao carregar palpites:",
            erro
        );


        throw erro;

    }

}
