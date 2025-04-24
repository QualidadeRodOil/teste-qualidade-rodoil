const combustiveis = {
  gasolina: {min:715, max:770, coef: 0.00064},
  etanol: {tabela: true}, // etanol tratado com base em tabela densidade x temperatura
  diesel: {min:815, max:850, coef: 0.00064},
  diesel500: {min:815, max:865, coef: 0.00064}
};

// Faixas válidas aproximadas para etanol hidratado por temperatura (simplificadas)
const faixaEtanolPorTemperatura = [
  {temp: 15, min: 810.6, max: 819.6},
  {temp: 20, min: 807.3, max: 816.3},
  {temp: 25, min: 804.0, max: 813.0},
  {temp: 30, min: 800.7, max: 809.7}
];

function faixaEtanol(t) {
  // Encontrar faixa correspondente ou interpolar
  for (let i = 0; i < faixaEtanolPorTemperatura.length - 1; i++) {
    const atual = faixaEtanolPorTemperatura[i];
    const prox = faixaEtanolPorTemperatura[i + 1];
    if (t >= atual.temp && t <= prox.temp) {
      const frac = (t - atual.temp) / (prox.temp - atual.temp);
      const min = atual.min + frac * (prox.min - atual.min);
      const max = atual.max + frac * (prox.max - atual.max);
      return {min, max};
    }
  }
  return faixaEtanolPorTemperatura[0]; // default
}

function corr(d, t, coef) {
  const fator = 1 + coef * (t - 20);
  return d / fator;
}

document.getElementById('check').addEventListener('click', ()=> {
  let density = parseFloat(document.getElementById('density').value);
  const unit = document.getElementById('unit').value;
  const t = parseFloat(document.getElementById('temp').value);
  if(unit==='g') density*=1000;
  if(isNaN(density)||isNaN(t)) return;
  const fuel = document.getElementById('fuel').value;
  const spec = combustiveis[fuel];

  let result = '';
  let dentro = false;

  if (spec.tabela) {
    const faixa = faixaEtanol(t);
    dentro = density >= faixa.min && density <= faixa.max;
    result = `Densidade medida: <b>${density.toFixed(1)} kg/m³</b><br>Temperatura: ${t.toFixed(1)} °C<br>Faixa ANP esperada: ${faixa.min.toFixed(1)} - ${faixa.max.toFixed(1)} kg/m³`;
  } else {
    const d20 = corr(density, t, spec.coef);
    dentro = d20 >= spec.min && d20 <= spec.max;
    result = `Densidade corrigida: <b>${d20.toFixed(1)} kg/m³</b><br>Faixa ANP: ${spec.min} - ${spec.max} kg/m³`;
  }

  const resDiv = document.getElementById('result');
  resDiv.style.background = dentro ? '#16a34a' : '#dc2626';
  resDiv.style.display = 'block';
  resDiv.innerHTML = result + `<br>${dentro ? 'Dentro da especificação' : 'Fora da especificação'}`;
});
