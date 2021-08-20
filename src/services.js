import axios from 'axios';
import reduxjs from 'redux-js';
import { Link as RouterLink } from "react-router-dom";

export const api_url = process.env.REACT_APP_API_URL;

export const redux = reduxjs;

export const Link = RouterLink;

export async function get(url, params={}){

  //loader es para habilitar el component loader
  redux.push('loader', true);
  let data = null;
  try {
    const response = await axios.get(api_url+url, { params });
    data = response.data.data??null;
  }
  catch (ex) {
     let error = null;
      if (ex.request) {
        error = {message:'Error en Conexión', code:'404'};
      }
    else {
        error = {message:ex.message, code:'500'};
    }
    redux.push('errors', [error]);
    console.error(error);
  }
  redux.push('loader', false);
  return data;
}