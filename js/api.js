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

    method,

    headers: {

      "Content-Type":
        "application/json"

    }

  };


  if (body) {

    config.body =
      JSON.stringify(body);

  }


  const response =
    await fetch(
      url,
      config
    );


  if (!response.ok) {

    throw new Error(
      "Erro HTTP " +
      response.status
    );

  }


  const data =
    await response.json();


  return data;

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
