

let load = document.querySelector('.load');

fetch('https://dadosabertos.camara.leg.br/api/v2/deputados', {
   headers: {
      'Accept': "application/json"
   }
})
   .then(response => response.ok())
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
                        <button class="btn" data-id="${e.id}">Gastos</button>
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
   let button = document.querySelectorAll('button');
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
               // if (response) modal.classList.add('active');
               let valor  = 0;
               response.dados.forEach(e => {
                  valor = valor + e.valorDocumento;
               })

               console.log(Math.round(valor))
            })
      });
   })
}