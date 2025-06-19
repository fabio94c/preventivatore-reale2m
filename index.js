
import React, { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    reddito1: '', reddito2: '', eta1: '', eta2: '', durata: '', mutuo: '', valore: '',
    nucleo: '', finalita: '', lavoro: '', determinatoMesi: '', rate: '', spa: ''
  });
  const [esito, setEsito] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const calcola = () => {
    const redditoTot = parseFloat(form.reddito1 || 0) + parseFloat(form.reddito2 || 0);
    const rateInCorso = parseFloat(form.rate || 0);
    const rataMaxING = (redditoTot * 0.55) - rateInCorso;
    const rataMaxMPS = (redditoTot * 0.33) - rateInCorso;
    const rataMax40 = (redditoTot * 0.4) - rateInCorso;

    const durata = parseInt(form.durata);
    const etaFinale1 = parseInt(form.eta1 || 0) + durata;
    const etaFinale2 = parseInt(form.eta2 || 0) + durata;
    const etaOkMPS = (etaFinale1 <= 75) && (form.eta2 ? etaFinale2 <= 75 : true);

    const LTV = parseFloat(form.mutuo) / parseFloat(form.valore);
    const rataSimulata = (parseFloat(form.mutuo) * 0.039 / 12) / (1 - Math.pow(1 + 0.039 / 12, -durata * 12));
    const sogliaMPS = [800, 1000, 1200, 1350, 1600][parseInt(form.nucleo || 1) - 1];
    const sussistenzaOK = (redditoTot - rateInCorso - rataSimulata) > sogliaMPS;

    setEsito({
      ING: (rataSimulata <= rataMaxING && sussistenzaOK) ? '✅' : '❌',
      MPS: (rataSimulata <= rataMaxMPS && etaOkMPS && sussistenzaOK) ? '✅' : '❌',
      BNL: (rataSimulata <= rataMax40 && sussistenzaOK) ? '✅' : '❌',
      CheBanca: (rataSimulata <= rataMax40 && sussistenzaOK) ? '✅' : '❌',
      Banco: (rataSimulata <= rataMax40 && sussistenzaOK) ? '✅' : '❌',
      rata: rataSimulata.toFixed(2), LTV: (LTV * 100).toFixed(1) + '%'
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Preventivatore Mutuo</h1>
      <p>Inserisci i dati per verificare la fattibilità:</p>
      <div style={{ display: 'grid', gap: 10 }}>
        {[
          ['Reddito Richiedente 1', 'reddito1'], ['Reddito Richiedente 2', 'reddito2'],
          ['Età 1', 'eta1'], ['Età 2', 'eta2'], ['Durata mutuo (anni)', 'durata'],
          ['Importo mutuo richiesto', 'mutuo'], ['Valore immobile', 'valore'],
          ['Rate mensili in corso', 'rate'], ['Numero componenti nucleo', 'nucleo']
        ].map(([label, name]) => (
          <input key={name} name={name} placeholder={label} onChange={handleChange} />
        ))}
        <button onClick={calcola}>Calcola Fattibilità</button>
      </div>
      {esito && (
        <div style={{ marginTop: 30 }}>
          <h3>Esito Simulazione</h3>
          <p><strong>Rata stimata:</strong> € {esito.rata}</p>
          <p><strong>LTV:</strong> {esito.LTV}</p>
          <ul>
            <li><strong>ING:</strong> {esito.ING}</li>
            <li><strong>BNL:</strong> {esito.BNL}</li>
            <li><strong>CheBanca:</strong> {esito.CheBanca}</li>
            <li><strong>MPS:</strong> {esito.MPS}</li>
            <li><strong>Banco di Sardegna:</strong> {esito.Banco}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
