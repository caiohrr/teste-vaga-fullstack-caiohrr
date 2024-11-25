// Formatação de valores

function formatarValores(data, currency) {
  data.vlTotal = currency.format(data.vlTotal);
  data.vlPresta = currency.format(data.vlPresta);
  data.vlMora = currency.format(data.vlMora);
  data.vlMulta = currency.format(data.vlMulta);
  data.vlOutAcr = currency.format(data.vlOutAcr);
  data.vlIof = currency.format(data.vlIof);
  data.vlDescon = currency.format(data.vlDescon);
  data.vlAtual = currency.format(data.vlAtual);
}

module.exports = formatarValores;
