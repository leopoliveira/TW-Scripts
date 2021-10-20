// ==UserScript==
// @name         Verificador de Populção x Disponibilidade
// @namespace    https://github.com/leopoliveira
// @version      1.0
// @description  Get all population used by every village and then calculates % fully is the farm
// @author       Leonardo Oliveira
// @include      https://*screen=overview_villages&mode=prod
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?domain=tribalwars.com.br
// @grant        none
// ==/UserScript==

setTimeout(popDisp, 3000);
//addEventListener("load", popDisp);


function popDisp() {
    'use strict';

    //Declaração das variáveis:

    let aldeia = document.querySelectorAll("#production_table > tbody > tr > td:nth-child(2)");
    let arrAldeia = [];
    let arrAldeiaLink = [];
    let arrAldeiaLinkAux = document.querySelectorAll("#production_table > tbody > tr > td:nth-child(2) > span > span > a:nth-child(1)");
    let fazenda = document.querySelectorAll("#production_table > tbody > tr > td:nth-child(7)");
    let arrFazenda = [];
    let arrFazendaLink = [];
    let arrPopAux = [];
    let arrPopPercentDisp = [];
    let areaGrupos = document.querySelector(".vis_item");
    let resultTable = document.createElement("table");
    let html = "";
    //const percentAlert = prompt("Insira o percentual máximo para marcar (somente números): ");
    const percentAlert = prompt("Type maximum percent to mark (only numbers): ");
    
    

    //Guarda os valores importantes encontrados das coordenadas das aldeias e da população em arrays:

    for(let i of aldeia){
        arrAldeia.push(i.innerText);
    }

    for(let i of fazenda){
        arrFazenda.push(i.innerText);
    }

    //Cálculo da % de população disponível:

    for(let i = 0; i < arrFazenda.length; i++){
        arrPopAux = arrFazenda[i].split("/");
        arrPopPercentDisp.push(Math.abs(Number(arrPopAux[0]/arrPopAux[1]*100)-100).toFixed(2));
    }

    //Pegando o link de referência das aldeias:

    for(let i = 0; i < arrAldeiaLinkAux.length; i++){
        arrAldeiaLink.push(arrAldeiaLinkAux[i].getAttribute("href"));
    }

    //Pegando o link de referência das aldeias e mudando para abrir a fazenda:
    for(let i = 0; i < arrAldeiaLinkAux.length; i++){
        arrFazendaLink.push(arrAldeiaLinkAux[i].getAttribute("href").replace("overview", "farm"));
    }

    //Gerando a tabela dos resultados na tela:
    //Aplicando estilos iniciais:
    html = `<style>
        .percentPop {
            text-align: center;
            width: 100%;
        }

        .percentPop tbody tr {
            background-color: #fff5da;
        }

        .percentPop tbody tr:nth-child(2n+1) {
            background-color: #f0e2be;
        }

        .percentPop caption {
            font-size: 20px;
            font-weight: bold;
            background-color: #d3b271;
            padding: 8px 0;
        }

        .percentPop th {
            font-size: 16px;
            text-align: center;
            padding: 5px 0;
        }
    </style>`;

    //Estrutura inicial da tabela, contendo descrição e título:
    html += `
    <caption>Available Population per Village</caption>
    <thead>
        <tr>
            <th>Village</th>
            <th>Available Population</th>
        </tr>
    </thead>`;

    let tamanhoArr = arrFazenda.length;

    html += "<tbody>"

    //Cria as linhas da tabela baseado na quantidade de informações coletadas anteriormente:
    for(let i = 0; i < tamanhoArr; i++) {
        if(Number(arrPopPercentDisp[i]) < `${percentAlert}`) {
            html += `
            <tr style="background-color: #FDE112; color: #603000; font-weight: bold">
                <td><a href="${arrAldeiaLinkAux[i]}">${arrAldeia[i]}</a></td>
                <td><a href="${arrFazendaLink[i]}">${arrPopPercentDisp[i]} %</a></td>
            </tr>`;
        } else {
            html += `
            <tr>
                <td><a href="${arrAldeiaLinkAux[i]}">${arrAldeia[i]}</a></td>
                <td><a href="${arrFazendaLink[i]}">${arrPopPercentDisp[i]} %</a></td>
            </tr>`;
        }
    }

    html += "</tbody>";

    //Escreve o HTML montado na variável que contém o elemento tabela criado:
    resultTable.innerHTML = html;

    //Cria o novo elemento após o elemento areaGrupos na tela do jogo:
    areaGrupos.after(resultTable);
    //resultTable.setAttribute("class", "percentPop vis");
    resultTable.setAttribute("class", "percentPop")
};
