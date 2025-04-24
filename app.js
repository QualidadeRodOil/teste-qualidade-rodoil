const combustiveis = {
  gasolina: {min:715, max:770},
  etanol: {min:765, max:796},
  diesel: {min:815, max:850},
  diesel500: {min:815, max:865}
};
function corr(d, t) {
  const fator = 1 + 0.00064 * (t - 20);
  return d / fator;
}
document.getElementById('check').addEventListener('click', ()=> {
  let density = parseFloat(document.getElementById('density').value);
  const unit = document.getElementById('unit').value;
  const t = parseFloat(document.getElementById('temp').value);
  if(unit==='g') density*=1000;
  if(isNaN(density)||isNaN(t)) return;
  const d20 = corr(density, t);
  const fuel = document.getElementById('fuel').value;
  const spec = combustiveis[fuel];
  const dentro = d20>=spec.min && d20<=spec.max;
  const resDiv = document.getElementById('result');
  resDiv.style.background = dentro?'#16a34a':'#dc2626';
  resDiv.style.display='block';
  resDiv.innerHTML = `Densidade corrigida: <b>${d20.toFixed(1)} kg/m³</b><br>Faixa ANP: ${spec.min} - ${spec.max} kg/m³<br>${dentro?'Dentro da especificação':'Fora da especificação'}`;
});