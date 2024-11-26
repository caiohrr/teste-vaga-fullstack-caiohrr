// Formatação de valores

function formatacaoEmReal(str) {
    const brazilianCurrencyRegex = /^R\$\s?\u00A0?\d{1,3}(\.\d{3})*,\d{2}$/;
    return brazilianCurrencyRegex.test(str);
}

function formatarValor(value, currency) {
  return formatacaoEmReal(value) ? `"${value}"` : `"${currency.format(value)}"`;
}

// Realiza-se uma verificação antes de formatar, caso o valor já esteja correto
function formatarValores(data, currency) {
  data.vlTotal  = formatarValor(data.vlTotal,  currency);
  data.vlPresta = formatarValor(data.vlPresta, currency);
  data.vlMora   = formatarValor(data.vlMora,   currency);
  data.vlMulta  = formatarValor(data.vlMulta,  currency);
  data.vlOutAcr = formatarValor(data.vlOutAcr, currency);
  data.vlIof    = formatarValor(data.vlIof,    currency);
  data.vlDescon = formatarValor(data.vlDescon, currency);
  data.vlAtual  = formatarValor(data.vlAtual,  currency);
}

module.exports = formatarValores;
