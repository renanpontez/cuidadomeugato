"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'

const ALLOWED_PEOPLE = [
  'Felipe',
  'Loira',
  'Elma',
  'Titeco',
  'Vitória',
  'Dessinha',
  'Renan',
]

export default function Page() {
  const [visitor, setVisitor] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(true)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [showGreeting, setShowGreeting] = useState(false)
  const [greetingText, setGreetingText] = useState('')
  const suggestions = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (q.length < 3) return [] as string[]
    return ALLOWED_PEOPLE.filter(p => p.toLowerCase().includes(q))
  }, [debouncedQuery])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250)
    return () => clearTimeout(t)
  }, [query])
  const listToPlain = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return ''
    const items = Array.from(el.querySelectorAll('li'))
    return items.map(li => `• ${li.textContent?.trim() ?? ''}`).join('\n')
  }, [])

  const copyList = useCallback((id: string) => {
    const txt = listToPlain(id)
    if (!txt) return
    navigator.clipboard.writeText(txt).then(() => {
      alert('Checklist copiado! Pode colar no WhatsApp 👍')
    })
  }, [listToPlain])

  const copyMaster = useCallback(() => {
    const master = `REGRAS RÁPIDAS

- Nunca juntar Smoke e filhote.
- Varanda SEMPRE fechada ao sair do apartamento.
- Filhote só na sala com Smoke no quarto (porta fechada).
- Banheiro social travado aberto para Smoke.
- Escritório do filhote: fechar porta (trinco + alisar).


FLUXO SALA
1) Levar Smoke ao quarto (convide com ração ou pegue no colo e coloque na cama) e fechar.
2) Fechar varanda; soltar filhote na sala (supervisão).
3) Brincar 20–30 min; preparar ração úmida (7–8 g).
4) Devolver filhote ao escritório; fechar bem.
5) Se ficar no apto, reabrir quarto/varanda. Ao sair: VARANDA FECHADA.`
    navigator.clipboard.writeText(master).then(() => {
      alert('Resumo mestre copiado! 👍')
    })
  }, [])

  const handlePrint = useCallback(() => window.print(), [])
  const [menuOpen, setMenuOpen] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)

  const getGreeting = useCallback((name: string): string => {
    switch (name) {
      case 'Elma':
        return 'Obrigado amiga! Espero um dia apresentar o Picoto pra Nenel e Pagu 🙂'
      case 'Titeco':
        return 'Ei man, num tem eu né?! Valeu bicho fei! Leva o Pitoco pra casa não mah pfv!'
      case 'Felipe':
        return 'Eiiii meu dev, vc é bom viunnn. Valeu por me apresentar o bichim e cuidar dele. É noiss!'
      case 'Dessinha':
        return 'Te amuuuu! <3'
      default:
        return 'Valeu por cuidar dos nossos gatimm <3'
    }
  }, [])

  return (
    <>
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-card">
            <h2 className="text-lg font-semibold">Quem tá por aqui hoje?</h2>
            <p className="mt-1 text-sm text-muted">Digite seu nome e receba instruções específicas 🙂</p>
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Digite o nome..."
              className="mt-3 w-full rounded-xl border border-line bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
            {debouncedQuery.length >= 3 && (
              <div className="mt-2 max-h-56 overflow-auto rounded-xl border border-line">
                {suggestions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted">Nenhum resultado.</div>
                ) : (
                  <ul className="divide-y divide-line">
                    {suggestions.map(name => (
                      <li key={name}>
                        <button
                          className="block w-full px-3 py-2 text-left hover:bg-gray-50"
                          onClick={() => {
                            setVisitor(name)
                            setModalOpen(false)
                            setGreetingText(getGreeting(name))
                            setShowGreeting(true)
                          }}
                        >
                          {name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {/* <div className="mt-3 flex flex-wrap gap-2">
              {ALLOWED_PEOPLE.map(name => (
                <button key={name} className="badge" onClick={() => { setVisitor(name); setModalOpen(false) }}>{name}</button>
              ))}
            </div> */}
          </div>
        </div>
      )}
      {showGreeting && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/30 p-4">
          <div className="text-center flex flex-col items-center justify-center gap-5 w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-card transition-all duration-300 ease-out animate-[fadeIn_.3s_ease-out]">
            <div className="text-2xl">🧡</div>
            <p className="mt-2 text-center text-lg">{greetingText}</p>
            <button className="btn primary" onClick={() => setShowGreeting(false)}>Ver Instruções</button>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-50  bg-[rgba(250,250,250,.95)] backdrop-blur-md">
        <div className="flex items-center justify-center gap-4 px-6 py-3.5 ">
          <div>
            <h1 className="m-0 text-[clamp(1.35rem,2.2vw,1.9rem)] mx-auto text-center font-semibold">Guia de Cuidados – Smoke 🐈‍⬛ & Picoto 🐾</h1>
            <p className="text-center">Valeu por cuidarem dos gatinhos! 🧡</p>
            <div className="mt-2 flex flex-wrap gap-2 w-full">
              <span className="badge">Período: 31/10 (qui) – 05/11 (ter) 00:00</span>
              <span className="badge">Objetivo: segurança + rotina + <b>sem contato</b></span>
            </div>
          </div>
        </div >
        <div className="mx-auto max-w-[1100px] px-6 border-t border-solid border-line border-b
          pt-3 pb-3">
          <div className="relative my-3 flex flex-row justify-between items-center ">
            <div className="inline-block">
              <button
                className="btn"
                onClick={() => setMenuOpen(v => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                ☰ Menu rápido
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute z-50 mt-2 w-72 rounded-xl border border-line bg-white shadow-card"
                >
                  <div className="flex flex-col p-2">
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#regras" onClick={() => setMenuOpen(false)}>Regras</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#fluxo-sala" onClick={() => setMenuOpen(false)}>Fluxo: soltar filhote na sala</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#ambientes" onClick={() => setMenuOpen(false)}>Ambientes</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#smoke" onClick={() => setMenuOpen(false)}>Smoke</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#filhote" onClick={() => setMenuOpen(false)}>Filhote</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#alimentacao" onClick={() => setMenuOpen(false)}>Alimentação</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#limpeza" onClick={() => setMenuOpen(false)}>Limpeza & Segurança</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#cronograma" onClick={() => setMenuOpen(false)}>Cronograma</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#pessoas" onClick={() => setMenuOpen(false)}>Instruções por Pessoa</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#checklists" onClick={() => setMenuOpen(false)}>Checklists WhatsApp</a>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-row gap-2">
              {visitor && (
                <span className="badge">Visitante: <b>{visitor}</b></span>
              )}
              {visitor && (
                <button className="btn" onClick={() => { setModalOpen(true); setQuery(''); setDebouncedQuery('') }}>Trocar</button>
              )}
            </div>

          </div>
        </div>
      </header >

      <main className={`mx-auto max-w-[1100px] px-6 transition-opacity duration-500 ${showGreeting ? 'opacity-50' : 'opacity-100'}`}>
        {/* Instruções por pessoa no topo, filtradas pelo visitante */}
        <section id="pessoas" className="card my-7">
          <h2 className="mb-2 text-xl font-semibold">👥 Instruções rápidas</h2>
          {!visitor && (
            <p className="text-muted">Selecione seu nome para ver instruções específicas.</p>
          )}
          {(visitor === 'Felipe') && (
            <details open className="mb-2 border border-line rounded-xl bg-white p-3">
              <summary className="cursor-pointer font-bold text-ink">Felipe — Sexta (tarde → noite)</summary>
              <ol className="ml-5 mt-2 list-decimal space-y-1">
                <li>Leve a Smoke ao quarto (convide com ração ou pegue no colo e deixe na cama). <b>Feche a porta do quarto.</b></li>
                <li><b>Feche a varanda.</b> Traga o filhote para a sala e brinque 20–30 min.</li>
                <li>Prepare a ração úmida do filhote (7–8 g; textura mole não papada); repor água dos dois.</li>
                <li>Devolva o filhote ao escritório e <b>feche bem</b> a porta (trinco + alisar).</li>
                <li>Reabra a varanda e o quarto se ainda ficar no apto. <b>Ao sair do apto: varanda fechada.</b></li>
              </ol>
            </details>
          )}

          {(visitor === 'Loira') && (
            <details className="mb-2 border border-line rounded-xl bg-white p-3">
              <summary className="cursor-pointer font-bold text-ink">Loira — Sábado (08h–13h) • Limpeza (PASSO A PASSO)</summary>
              <ol className="ml-5 mt-2 list-decimal space-y-1">
                <li><b>Antes de começar:</b> colocar a Smoke no quarto (pode pegar no colo); <b>fechar a porta do quarto</b> e <b>fechar a varanda</b>.</li>
                <li>Levar o filhote para a <b>sala</b> com portas/varanda <b>fechadas</b>.</li>
                <li>Limpar o <b>escritório</b> com o filhote na sala.</li>
                <li>Ao terminar o escritório: devolver o filhote para lá e <b>fechar bem</b> a porta (trinco + alisar).</li>
                <li>Limpar a <b>sala</b>, depois abrir o quarto para a Smoke, se desejar.</li>
                <li>Repor água; dar 1 sachê para a Smoke se ela aceitar.</li>
                <li><b>Ao sair do apartamento:</b> conferir portas, filhote no escritório, <b>varanda fechada</b>.</li>
              </ol>
            </details>
          )}

          {(visitor === 'Elma') && (
            <details className="mb-2 border border-line rounded-xl bg-white p-3">
              <summary className="cursor-pointer font-bold text-ink">Elma — Sábado (16h–19h)</summary>
              <ol className="ml-5 mt-2 list-decimal space-y-1">
                <li>Conduza a Smoke ao quarto e <b>feche</b>.</li>
                <li>Feche a varanda, solte o filhote na sala e brinque 20–30 min.</li>
                <li>Prepare a ração úmida; repor água dos dois.</li>
                <li>Devolva o filhote ao escritório e <b>feche bem</b>; reabra varanda/quarto se ficar.</li>
                <li><b>Ao sair:</b> varanda fechada.</li>
              </ol>
            </details>
          )}

          {(visitor === 'Titeco') && (
            <details className="mb-2 border border-line rounded-xl bg-white p-3">
              <summary className="cursor-pointer font-bold text-ink">Titeco — Domingo (10h–12h)</summary>
              <ol className="ml-5 mt-2 list-decimal space-y-1">
                <li>Checar água, comida e caixas.</li>
                <li>Fluxo de brincadeira igual (Smoke no quarto; varanda fechada; filhote na sala).</li>
                <li><b>Ao sair:</b> filhote no escritório; <b>varanda fechada</b>.</li>
              </ol>
            </details>
          )}

          {(visitor === 'Vitória') && (
            <details className="mb-2 border border-line rounded-xl bg-white p-3">
              <summary className="cursor-pointer font-bold text-ink">Vitória — Domingo (tarde, a confirmar)</summary>
              <ol className="ml-5 mt-2 list-decimal space-y-1">
                <li>Visita extra: água, comida, portas; pode brincar com o filhote seguindo o fluxo.</li>
                <li><b>Ao sair:</b> varanda fechada.</li>
              </ol>
            </details>
          )}

          {(visitor === 'Andressa') && (
            <details className="mb-2 border border-line rounded-xl bg-white p-3">
              <summary className="cursor-pointer font-bold text-ink">Andressa — A partir de domingo 21h</summary>
              <ul className="ml-5 mt-2 list-disc">
                <li>Assume a mesma rotina e separação entre os gatos.</li>
              </ul>
            </details>
          )}
        </section>

        <section id="regras" className="my-7">
          <div className="card alert">
            <h2 className="mb-2 text-xl font-semibold">⚠️ Regras de ouro (ATUALIZADO)</h2>
            <ul className="ml-5 mt-2 list-disc">
              <li><b>Nunca</b> deixar Smoke e filhote no mesmo cômodo.</li>
              <li><b>Varanda sempre fechada ao sair do apartamento</b>.</li>
              <li><b>Filhote só pode brincar na sala se a Smoke estiver no quarto</b> (porta do quarto fechada).</li>
              <li><b>Banheiro social travado aberto</b> para a Smoke usar a caixa sem risco de a porta bater.</li>
              <li><b>Porta do escritório</b>: levantar o trinco, empurrar o <i>alisar</i> e puxar a porta até travar.</li>
            </ul>
          </div>
        </section>

        <section id="fluxo-sala" className="card callout">
          <h2 className="mb-2 text-xl font-semibold">🧭 Fluxo seguro para soltar o filhote na sala</h2>
          <ol className="ml-5 list-decimal space-y-2">
            <li><b>Conduza a Smoke ao quarto</b> com tato:
              <ul className="ml-5 mt-2 list-disc">
                <li>Chame com voz suave; aponte ração; faça barulhinho do sachê.</li>
                <li>Se preferir, pode <b>pegar no colo</b> e colocá-la sobre a cama (ela gosta).</li>
              </ul>
            </li>
            <li><b>Feche a porta do quarto</b> e <b>feche a varanda</b>.</li>
            <li><b>Abra o escritório</b> e traga o filhote para brincar na sala (supervisionado).</li>
            <li>Ao finalizar:
              <ul className="ml-5 mt-2 list-disc">
                <li><b>Devolva o filhote ao escritório</b> e <b>feche bem</b> a porta (trinco + alisar).</li>
                <li>Se você ainda for ficar no apto: <b>pode reabrir a varanda</b> e a porta do quarto para a Smoke circular.</li>
              </ul>
            </li>
          </ol>
        </section>

        {/* Organização do apartamento em largura total, objetivos abaixo */}
        <section id="ambientes" className="my-7">
          <div className="card">
            <h2 className="mb-2 text-xl font-semibold">🏠 Organização do apartamento</h2>
            <table className="table">
              <thead>
                <tr><th>Cômodo</th><th>Uso</th><th>Gato</th><th>Observações</th></tr>
              </thead>
              <tbody>
                <tr><td>Escritório</td><td>Ambiente principal</td><td>🐾 Filhote</td><td>Fica a maior parte do tempo. Pode ventilar quando alguém estiver dentro. Fechar ao sair.</td></tr>
                <tr><td>Sala</td><td>Brincadeiras</td><td>🐾 Filhote / 🐈‍⬛ Smoke</td><td>Filhote só na sala com a Smoke no quarto e varanda fechada.</td></tr>
                <tr><td>Quarto</td><td>Refúgio</td><td>🐈‍⬛ Smoke</td><td>Usado para conter a Smoke durante as brincadeiras do filhote.</td></tr>
                <tr><td>Banheiro social</td><td>Caixa de areia</td><td>🐈‍⬛ Smoke</td><td>Porta travada aberta (anti-vento). Outra porta pode ficar aberta e bloqueada com caixa.</td></tr>
                <tr><td>Varanda</td><td>Passeio</td><td>🐈‍⬛ Smoke</td><td>Pode abrir com filhote trancado. <b>Sempre fechar ao sair do apto.</b></td></tr>
              </tbody>
            </table>
          </div>

          <div className="card mt-4">
            <h2 className="mb-2 text-xl font-semibold">🎯 Objetivo por período</h2>
            <ul className="ml-5 list-disc">
              <li>Qui 31/10 tarde → Casa organizada (portas/travas/varanda checadas).</li>
              <li>Sex 01/11 → Felipe mantém rotina e brincadeiras seguras.</li>
              <li>Sáb 02/11 manhã → <b>Loira</b> limpeza com protocolo (ver instruções por pessoa).</li>
              <li>Sáb 02/11 tarde → Elma reforça água, comida e portas.</li>
              <li>Dom 03/11 manhã → Titeco visita; checagem geral.</li>
              <li>Dom 03/11 tarde → Vitória (a confirmar) visita extra.</li>
              <li>Dom 03/11 21h → Andressa assume rotina.</li>
              <li>Ter 05/11 00:00 → Retorno do Renan.</li>
            </ul>
          </div>
        </section>

        <hr />



        {/* Dados importantes: alimentação, limpeza, sinais, varanda */}
        <section id="dados-importantes" className="my-7 grid gap-4 md:grid-cols-2">
          <div className="card" id="alimentacao">
            <h3 className="mb-2 text-lg font-semibold">🍽️ Alimentação do filhote</h3>
            <ol className="ml-5 list-decimal space-y-1">
              <li>Esquentar <b>½ xícara de água</b> por <b>1 min</b> (micro-ondas).</li>
              <li>Pesar <b>7–8 g</b> de ração (balança branca).</li>
              <li>Misturar até ficar <b>mole, mas não papada</b>; escorrer excesso.</li>
              <li>Servir no pratinho dele (ao lado do automático). Pode usar ração do automático para amolecer.</li>
              <li>Ele pode demorar — costuma voltar depois.</li>
            </ol>
          </div>
          <div className="card">
            <h3 className="mb-2 text-lg font-semibold">🧼 Limpeza & Segurança</h3>
            <ul className="ml-5 list-disc">
              <li>Caixa do filhote: <b>escritório</b>. Caixa da Smoke: <b>banheiro social</b>.</li>
              <li>Banheiro social: <b>porta travada aberta</b>.</li>
              <li>Depois de limpar o escritório: <b>devolver filhote</b> e <b>fechar bem</b> (trinco + alisar).</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="mb-2 text-lg font-semibold">🚑 Sinais de alerta</h3>
            <ul className="ml-5 list-disc">
              <li>Não comer, vômito, diarreia, apatia.</li>
              <li>Briga/arranhões ou tentativa de fuga.</li>
              <li><b>Acionar</b> Renan/Andressa e, se preciso, levar ao veterinário.</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="mb-2 text-lg font-semibold">🌤️ Quando abrir a varanda?</h3>
            <ul className="ml-5 list-disc">
              <li><span className="ok">Pode abrir</span> quando o filhote estiver <b>trancado</b> no escritório.</li>
              <li><span className="warn">Feche sempre</span> com o filhote solto <u>ou</u> ao sair do apartamento.</li>
            </ul>
          </div>
        </section>

        <section id="limpeza" className="my-7 grid gap-4 md:grid-cols-2">
          <div className="card">
            <h2 className="mb-2 text-xl font-semibold">🧼 Limpeza & Segurança</h2>
            <ul className="ml-5 list-disc">
              <li>Caixa do filhote: <b>escritório</b>. Caixa da Smoke: <b>banheiro social</b>.</li>
              <li>Banheiro social: <b>porta travada aberta</b>.</li>
              <li>Depois de limpar o escritório: <b>devolver filhote</b> e <b>fechar bem</b> (trinco + alisar).</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="mb-2 text-lg font-semibold">🚑 Sinais de alerta</h3>
            <ul className="ml-5 list-disc">
              <li>Não comer, vômito, diarreia, apatia.</li>
              <li>Briga/arranhões ou tentativa de fuga.</li>
              <li><b>Acionar</b> Renan/Andressa e, se preciso, levar ao veterinário.</li>
            </ul>
          </div>
        </section>

        {/* Cronograma vira modal acessado por botão flutuante */}
        {scheduleOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={() => setScheduleOpen(false)}>
            <div className="w-full max-w-3xl rounded-2xl border border-line bg-white p-4 shadow-card" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="mb-2 text-xl font-semibold">📅 Cronograma de cuidadores</h2>
                <button className="btn" onClick={() => setScheduleOpen(false)}>Fechar</button>
              </div>
              <table className="table">
                <thead><tr><th>Dia</th><th>Pessoa</th><th>Horário</th><th>Tarefas principais</th></tr></thead>
                <tbody>
                  <tr><td>31/10 (qui)</td><td>Renan</td><td>Saída 15h</td><td>Organizar casa; revisar portas/travas; varanda fechada.</td></tr>
                  <tr><td>01/11 (sex)</td><td>Felipe</td><td>Tarde → noite</td><td>Brincar com filhote; alimentar; ventilação quando no ambiente; separar gatos; <b>fechar varanda ao sair</b>.</td></tr>
                  <tr><td>02/11 (sáb)</td><td>Loira</td><td>08h–13h</td><td>Limpeza com protocolo (ver seção “Instruções por Pessoa”).</td></tr>
                  <tr><td>02/11 (sáb)</td><td>Elma</td><td>16h–19h</td><td>Água/comida; brincar com filhote; conferir portas/varanda; <b>fechar varanda ao sair</b>.</td></tr>
                  <tr><td>03/11 (dom)</td><td>Titeco</td><td>10h–12h</td><td>Checar caixas; alimentar; brincar supervisionado; <b>fechar varanda ao sair</b>.</td></tr>
                  <tr><td>03/11 (dom)</td><td>Vitória (a confirmar)</td><td>Tarde</td><td>Visita extra; rotinas e portas; <b>fechar varanda ao sair</b>.</td></tr>
                  <tr><td>03/11 (dom)</td><td>Andressa</td><td>Chega 21h</td><td>Assume rotina até o retorno.</td></tr>
                  <tr><td>05/11 (ter)</td><td>Renan</td><td>00:00</td><td>Retoma rotina normal.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <hr />
        {/* Instruções já movidas para o topo */}

        <section id="checklists" className="my-7 grid gap-4 md:grid-cols-2">
          <div className="card">
            <h2 className="mb-2 text-xl font-semibold">📝 Checklist rápido – Antes de sair do apartamento</h2>
            <ul id="before-exit" className="ml-5 list-disc">
              <li>Filhote no <b>escritório</b>; porta <b>bem fechada</b> (trinco + alisar).</li>
              <li>Smoke com acesso ao banheiro social (porta travada aberta).</li>
              <li><b>Varanda fechada.</b></li>
              <li>Água fresca para ambos; comida conforme rotina.</li>
            </ul>
            <button className="btn mt-2" onClick={() => copyList('before-exit')}>📋 Copiar</button>
          </div>

          <div className="card">
            <h2 className="mb-2 text-xl font-semibold">📝 Checklist rápido – Durante a visita</h2>
            <ul id="during-visit" className="ml-5 list-disc">
              <li>Conduzir Smoke ao quarto e fechar.</li>
              <li>Fechar varanda e soltar filhote na sala (supervisão).</li>
              <li>Brincar 20–30 min; preparar ração úmida; repor águas.</li>
              <li>Devolver filhote ao escritório e fechar bem.</li>
              <li>Reabrir quarto/varanda se ainda ficar no apto.</li>
            </ul>
            <button className="btn mt-2" onClick={() => copyList('during-visit')}>📋 Copiar</button>
          </div>
        </section>

        <hr />
        {/* Informações gerais dos gatinhos */}
        <section id="gatim-info" className="my-7 grid gap-4 md:grid-cols-2">
          <div className="card">
            <h2 className="mb-2 text-xl font-semibold">🐈‍⬛ Smoke <span className="pill smoke">independente</span></h2>
            <ul className="ml-5 list-disc">
              <li>Carinho, escova e <b>bolinha laranja</b> na varanda.</li>
              <li>Alimentação <b>automática</b>; pode ganhar 1 sachê de mimo.</li>
              <li>Água fresca sempre.</li>
              <li>Se rosnar, dê espaço — sem forçar contato com o filhote.</li>
            </ul>
          </div>
          <div className="card">
            <h2 className="mb-2 text-xl font-semibold">🐾 Filhote <span className="pill kitten">transição alimentar</span></h2>
            <ul className="ml-5 list-disc">
              <li>Fica no <b>escritório</b> quando sem supervisão.</li>
              <li>Pode brincar na sala com a Smoke no <b>quarto</b> e <b>varanda fechada</b>.</li>
              <li>Usa caixa de areia; se “esquecer”, mostrar o caminho.</li>
            </ul>
          </div>
        </section>
      </main>

      <div className="sticky-actions fixed bottom-4 right-4 flex flex-col gap-2">
        <button className="btn" onClick={() => setScheduleOpen(true)}>🗓️ Cronograma</button>
        <button className="btn primary" onClick={copyMaster}>📎 Copiar resumo mestre</button>
      </div>

      <footer className="mx-auto max-w-[1100px] px-6 py-8 text-sm text-muted">
        <p>Emergências: falar com Renan ou Andressa. Em sinais clínicos (apatia, diarreia, vômito, recusa alimentar), acionar veterinário.</p>
      </footer>
    </>
  )
}



