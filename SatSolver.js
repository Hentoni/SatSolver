
exports.solve = function(nomedoarquivo) {
  let formula = readFormula(nomedoarquivo); //separa os dados adequadamente
  let result = doSolve(formula.clauses, formula.variables); //Resolve =D
  return result;
}
//=========================================================================NEXT_ASSIGNMENT================================================================================//
function nextAssignment (assignment) { //testando todas as possibilidades
  for (i=0; i<assignment.length; i++) {
      if (assignment[i] === 0) {
          assignment[i] = 1;
          break;
      } else if (assignment[i] === 1) {
          if (i === assignment.length-1){
              finalAssignment = true;
          }
          assignment[i] = 0;
      }

  }
  return assignment;
}

var finalAssignment = false;
//====================================================================================DO_SOLVE============================================================================//
function doSolve (clauses, assignment) {

  let isSat = false; //satisfação
  while ((!isSat && !finalAssignment)) {
      let clausuraaux = true;  
      let contador = 0;
      for (let i=0; i<clauses.length && clausuraaux; i++) { //separa o teste de cada clasura
          clausuraaux = false;
          for (let j = 0; j < clauses[i].length; j++) { // separa o teste de cada variável 
              if ((clauses[i][j] > 0 && assignment[Math.abs(clauses[i][j]) - 1] === 1) || (clauses[i][j] < 0 && assignment[Math.abs(clauses[i][j]) - 1] === 0)) {
                  clausuraaux = true;
                  contador = i;
                  break;
              } 
          }
      }
          if (!clausuraaux) {
              assignment = nextAssignment (assignment);
          } else {
              if (contador === clauses.length-1) {
                  isSat = true;
              }
          }
  }

  let result = {'isSat': isSat, satisfyingAssignment: null};
  if (isSat) {
      result.satisfyingAssignment = assignment;
  }
  return result;
}
//====================================================================================Read_Formula===========================================================================//
function readFormula (nomedoarquivo) {

  let fs = require('fs'); //importa fs
  let arquivo = fs.readFileSync(nomedoarquivo, 'utf8'); //ler o arquivo
  let text = arquivo.split(/[\r\n]+/); //cria um array com as linhas separadas

  let clauses = readClauses(text); // separa as clausulas
  let variables = readVariables (clauses); //separando as variáveis
  let specOk = checkProblemSpecification (text, clauses, variables);

//====================================================================================Read_Clauses && Variables=============================================================//
  function readClauses (text) {
      let textaux = text.filter(function(linha){  //cria um novo array somente com as clausulas exceto as que começam com c ou p
          return linha [0] !== 'c' && linha[0] !== '' && linha[0] !== 'p' 
      });
      textaux = textaux.join (''); // todos os elementos são juntados sem nenhum caracter entre eles.
      textaux = textaux.split(" 0"); // separa as clasuras
      textaux.pop(); // remove o ultimo elemento do array que atualmente está vazio

      let clauses = []; //cria um novo array
      for (let i=0; i<textaux.length; i++) { // transforma cada clausura num array de variaveis
          clauses[i] = textaux[i].split(" ");
          for (j=0; j<clauses[i].length; j++) { // troca o tipo de string pra numero
            clauses[i][j] = parseInt(clauses[i][j])
          }
      }
      return clauses; //retorna o array de clausulas
  }

  function readVariables (clauses) {
      let variables = []; // cria um array 
      for (let i=0; i<clauses.length; i++) { //separando as váriaveis
          for (j = 0; j < clauses[i].length; j++) { // variáveis maior que o tamanho ainda não foram contadas
              while ((Math.abs(clauses[i][j])) > variables.length) {
                  variables.push(0); // adiciona o espaço para que a variável seja adicionada
              }
          }
      }
      return variables;
  }

  //=====================================COMPATIBILIDADE ENTRE LINHA E AS CLAUSURAS====================================//
  function checkProblemSpecification (text, clauses, variables) {
      let linhap = text.filter (function (linha) {
          return linha[0] === 'p' // extrai apenas a linha p do arquivo
      });
      linhap = linhap.join();
      linhap = linhap.split(' '); // coloca elementos da linha p num array
      let numVariables = parseInt(linhap[2]); // pega numero de variáveis
      let numClauses = parseInt(linhap[3]);  //pega o numero de clausulas

      // confere se os dois arrays correspondem aos da linha p
      var specOk = true;
      if (variables.length !== numVariables || clauses.length !== numClauses) {
          specOk = false;
      }
      return specOk;
  }

  //============================================================== RESULTADO DO READFORMULA===================================//
  let result = { 'clauses': [], 'variables': [] };
  if (specOk) {
      result.clauses = clauses;
      result.variables = variables;
  }
  return result;
}