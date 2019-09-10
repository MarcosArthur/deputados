


let load = document.querySelector('.load');

function handleErrors(response) {
   if (!response.ok) {
       throw Error(response.statusText);
   }
   return response;
}

fetch('https://dadosabertos.camara.leg.br/api/v2/deputados', {
   headers: {
      'Accept': "application/json"
   }
})
   .then(handleErrors)
   .then(response => response.json())
   .then(response => {
      // let load = document.querySelector('.load');
      let templete = " ";
      response.dados.forEach(e => {
         templete += `
                <div class="container__card">
                    <img src="${e.urlFoto}" alt="${e.urlFoto}" class="card__image">
                    <div class="card__information">
                        <h1>${e.nome}</h1>
                        <span>Partido ${e.siglaPartido}</span>
                        <span>UF: ${e.siglaUf}</span>
                        <a href="mailto:${e.email}">${e.email}</a>
                        <button class="btn button" data-id="${e.id}">Gastos</button>
                    </div>
                </div>
                `;
      })

      document.querySelector('.container').innerHTML = templete;
      load.remove();
      button();
   })
   .catch(() => {
      alert('error');
   })

function button() {
   let button = document.querySelectorAll('.button');
   let modal = document.querySelector('.modal');
   button.forEach(e => {
      e.addEventListener('click', event => {
         console.log('click')
         let id = event.target.dataset.id;

         fetch(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}/despesas`, {
            headers: {
               'Accept': "application/json"
            }
         })
            .then(response => response.json())
            .then(response => {
               console.log(response)
               if (response) modal.classList.add('active');
               let mes = [];
               let gastos = [];

               let table = " ";

               response.dados.forEach(e => {
                  mes.push(e.mes);
                  gastos.push(e.valorLiquido);
                  table+= `
                     <table class="table-info" c >
                        <thead>
                           <tr>
                              <td>
                                 Tipo Despesa
                              </td>
                              <td>
                                 Ano
                              </td>
                              <td>
                                Mês
                              </td>
                              <td>
                                 Nome Fornecedor
                              </td>
                              <td>
                                 Valor
                              </td>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td>
                                 ${e.tipoDespesa}
                              </td>

                              <td>
                                 ${e.ano}
                              </td>
                              <td>
                                 ${e.mes}
                              </td>

                              <td>
                                 ${e.nomeFornecedor}
                              </td>

                              <td>
                                R$ ${e.valorLiquido}
                              </td>

                           </tr>
                        </tbody>
                     <table>
                  `;
               })

               var ctx = document.getElementById('myChart').getContext('2d');
               var chart = new Chart(ctx, {
                   
                   type: 'line',
               
                   
                   data: {
                       labels:mes,
                       datasets: [{
                           label: 'Gastos Deputado(a)',
                           backgroundColor: 'rgb(255, 99, 132)',
                           borderColor: 'red',
                           data: gastos
                       }]
                   },
               
                   options: {
                    }
               });


               document.querySelector('.table-mount').innerHTML = table;
               
            })
      });
   })
}


document.querySelector('.close').addEventListener('click', function() {
   document.querySelector('.modal').classList.remove('active');
})