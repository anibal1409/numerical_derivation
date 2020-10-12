window.location.href = "index.html?#";
const table = document.querySelector('#table_func');
const contentResult = document.querySelector('#content__result');
const listResult = document.querySelector('#list_result');

const TABLE = [1, 1, 2.148721271, 3.718281828, 5.98168907, 9.389056099, 1];
const INDEX_INPUT = [-3, -2, -1, 0, 1, 2, 3];
const PRE_ID_INPUT_X = 'inputX';
const ID_INPUT_H = 'inputH';
const PRE_ID_INPUT_D = 'derivative';
const DERIVATION_SYMBOL = `'`;
const MAX_DEVIRATIVE = 3;

const FORM = [];

let tableCreate = false;


function onlyNumber(event, inputId) {
  console.log(event);
  let value = false;
  const inputValue = inputId.value;
  console.log(!!inputValue, inputValue.includes('.'));
  if ((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode === 8 || ((event.keyCode === 110 || event.keyCode === 190) && !!inputValue && !inputValue.includes('.'))) {
    value = true;
  }
  return value;
}


function createRow(text, inputId, content ) {
  const row = document.createElement('div');
  row.setAttribute('class', 'row');

  const div = document.createElement('div');
  div.setAttribute('class', 'col');
  div.appendChild(document.createTextNode(text));
  const span = document.createElement('span');
  span.setAttribute('class', 'input_required');
  span.appendChild(document.createTextNode('*'));
  div.appendChild(span);
  row.appendChild(div);

  const div2 = document.createElement('div');
  div2.setAttribute('class', 'col');
  const input = document.createElement('input');
  input.setAttribute('id', inputId);
  input.setAttribute('required', 'true');
  input.setAttribute('onkeydown', `return onlyNumber(event, ${inputId})`);
  // input.type = 'number';
  FORM.push(input);
  div2.appendChild(input);
  row.appendChild(div2);

  content.appendChild(row);
}

function createLi(derivative, content) {
  const li = document.createElement('li');

  const p1 = document.createElement('p');
  const span1 = document.createElement('span');
  span1.textContent = derivative.text;
  span1.setAttribute('class', 'text bold italic');
  p1.appendChild(span1);
  const text1 = document.createTextNode(` = ${derivative.derivative.toFixed(4)}`);
  p1.appendChild(text1);
  
  const p2 = document.createElement('p');
  const span2 = document.createElement('span');
  span2.textContent = 'Error';
  span2.setAttribute('class', 'text bold');
  p2.appendChild(span2);
  const text2 = document.createTextNode(` = ${derivative.error.toFixed(2)} %`);  
  p2.appendChild(text2);

  li.appendChild(p1);
  li.appendChild(p2);

  content.appendChild(li);
}

// CREAR INPUT DE FUNCION SEGUN PASOS
for (let i = 0; i < 7 ; i++) {
  createRow(`f(x${INDEX_INPUT[i]})`, `${PRE_ID_INPUT_X}${i}`, table);
}

const contentInfo = document.querySelector('#content_info');

// INPUT PARA EL PASO
createRow('h', ID_INPUT_H, contentInfo);

// CREAR INPUT DE DERIVADAS REALES
let symbol = '';
for (let i = 0; i < MAX_DEVIRATIVE ; i++) {
  symbol += DERIVATION_SYMBOL;
  createRow(`f${symbol}(x)`, `${PRE_ID_INPUT_D}${i}`, contentInfo);
}

// FUNCION PARA CALCULAR DERIVADA SEGUN FUNCION
function calculateDerevative(order, table, h) {
  // console.log('order', order);
  const index = MAX_DEVIRATIVE;
  let numerator = table[index];
  let denominator = 1;
  // console.log('numerator', numerator);
  for (let i = 1; i <= order; i++) {
    const multiplier = i == order ? 1 : order;
    // console.log('multiplier', multiplier);
    // console.log(table[index - i]);
    const valuFunc = (multiplier * table[index - i]);
    // console.log('valuFunc', valuFunc);
    if ((i % 2) === 0) {
      numerator +=  valuFunc;
    } else {
      numerator -=  valuFunc;
    }
    denominator *= h;
  }
  // console.log('denominator', denominator);
  return numerator / denominator;
}

// CALCULAR ERROR DE LA DERIVADA
function calculateError(derivativeTrue, derivativeApproximate) {
  return Math.abs((derivativeTrue - derivativeApproximate) / derivativeTrue) * 100;
}

const data = calculateDerevative(1, TABLE, 0.5);
// console.log(data);

const error = calculateError(3.718281828, data);
// console.log(error);


function tableValues() {
  const values = [];
  for (let i = 0; i < 7 ; i++) {
    const inputX = document.querySelector(`#${PRE_ID_INPUT_X}${i}`);
    values[i] = +inputX.value;
  }
  return values;
}

function derivativeTrueValues() {
  const values = [];
  for (let i = 0; i < 3 ; i++) {
    const inputX = document.querySelector(`#${PRE_ID_INPUT_D}${i}`);
    values[i] = +inputX.value;
  }
  return values;
}

function hValue() {
  return document.querySelector(`#${ID_INPUT_H}`).value;
}

function formInvalid() {
  let invalid = false;
  for (i = 0; i < FORM.length; i++) {
    const input = FORM[i];
    const value = !input.validity.valid;
    const nan = isNaN(input.value);
    if (value || nan) {
      input.setAttribute('class', 'input__invalid');
      invalid = {
        value,
        nan
      };
      break
    }
  }
  return invalid;
}

function manageDerivative() {
  const formInvalid = this.formInvalid();
  if (!formInvalid && !tableCreate) {
    const tableValues = this.tableValues();
    const derivativesTrue = this.derivativeTrueValues();
    const h = this.hValue();
    const derivatives = [];
    let symbol =  ' ';
    
    for (let i = 0; i < MAX_DEVIRATIVE; i++) {
      symbol += DERIVATION_SYMBOL;
      const derivative =  this.calculateDerevative(i + 1, tableValues, h);
      const error =  this.calculateError(derivativesTrue[i], derivative);
      const objectDerivative = {
        text: `f${symbol}(x)`,
        derivative,
        error,
      };
      derivatives.push(objectDerivative);
      this.createLi(objectDerivative, listResult);
    }
    console.log(derivatives);
    tableCreate = true;
    this.manageResult();
  } else {
    if (formInvalid.value) {
      alert('Debe ingresar todos los valores solicitados');
    } else {
      alert('Uno o varios de los valores ingresados no es un numero');
    }
  }
}

function manageResult() {
  console.log('manageResult', tableCreate);
  if (tableCreate) {
    contentResult.classList.remove('none');
  } else {
    contentResult.classList.add('none');
    listResult.innerHTML = '';
  }
}

function clearForm() {
  tableCreate = false;
  this.manageResult();
}
