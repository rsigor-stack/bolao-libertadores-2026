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
