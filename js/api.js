/**
 * ============================================================================
 * API DO BOLÃO
 * Comunicação com o Google Apps Script
 * ============================================================================
 */

const API_URL =
  "COLE_AQUI_A_URL_DO_WEB_APP_DO_GOOGLE_APPS_SCRIPT";


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

        body = null

    } = options;


    let url =
        API_URL +
        "?action=" +
        encodeURIComponent(action);


    const config = {

        method

    };


    /*
     * GET
     */

    if (
        method === "GET"
    ) {

        if (body) {

            Object.entries(
                body
            ).forEach(
                function([
                    chave,
                    valor
                ]) {

                    url +=
                        "&" +
                        encodeURIComponent(
                            chave
                        ) +
                        "=" +
                        encodeURIComponent(
                            valor
                        );

                }
            );

        }

    }


    /*
     * POST
     */

    if (
        method === "POST"
    ) {

        config.body =
            new URLSearchParams(
                body
            );

    }


    const response =
        await fetch(
            url,
            config
        );


    if (
        !response.ok
    ) {

        throw new Error(

            "Erro HTTP " +
            response.status

        );

    }


    const texto =
        await response.text();


    console.log(
        "Resposta recebida:",
        texto
    );


    try {

        return JSON.parse(
            texto
        );

    }
    catch (erro) {

        throw new Error(
            "Resposta inválida da API."
        );

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

  return apiRequest(

    "login",

    {

      method: "POST",

      body: {

        participante,

        senha

      }

    }

  );

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
