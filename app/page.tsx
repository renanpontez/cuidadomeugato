"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'

const ALLOWED_PEOPLE = [
  'Felipe',
  'Loira',
  'Elma',
  'Titeco',
  'Victória',
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
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const suggestions = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (q.length < 3) return [] as string[]
    return ALLOWED_PEOPLE.filter(p => p.toLowerCase().includes(q))
  }, [debouncedQuery])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250)
    return () => clearTimeout(t)
  }, [query])

  // Load checked items from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('checkedItems')
    if (stored) {
      try {
        setCheckedItems(JSON.parse(stored))
      } catch (e) {
        // ignore parse errors
      }
    }
  }, [])

  // Save checked items to localStorage
  useEffect(() => {
    localStorage.setItem('checkedItems', JSON.stringify(checkedItems))
  }, [checkedItems])
  const toggleChecked = useCallback((id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

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

  // Lock body scroll when schedule modal is open and add ESC to close
  useEffect(() => {
    if (scheduleOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setScheduleOpen(false)
      }
      window.addEventListener('keydown', onKey)
      return () => {
        document.body.style.overflow = original
        window.removeEventListener('keydown', onKey)
      }
    }
  }, [scheduleOpen])

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
            <h1 className="m-0 text-[clamp(1.35rem,2.2vw,1.9rem)] mx-auto text-center font-semibold">Guia de Cuidados <br />Smoke 🐈‍⬛ & Picoto 🐾</h1>
            <p className="text-center">Valeu por cuidarem dos gatinhos! 🧡</p>
            <div className="mt-2 flex flex-wrap gap-2 w-full justify-center">
              <span className="badge text-center">Período: 31/10 (qui) – 05/11 (ter) 00:00</span>
              <span className="badge text-center">Objetivo: segurança + rotina + <b>sem contato</b></span>
            </div>
          </div>
        </div >
        <div className="mx-auto max-w-[1100px] px-6 border-t border-solid border-line border-b
          pt-3 pb-3">
          <div className="relative my-3 flex flex-col gap-4 md:gap-0 justify-between items-center md:flex-row ">
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
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#pessoas" onClick={() => setMenuOpen(false)}>Instruções rápidas</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#regras" onClick={() => setMenuOpen(false)}>Regras</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#fluxo-sala" onClick={() => setMenuOpen(false)}>Fluxo seguro</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#ambientes" onClick={() => setMenuOpen(false)}>Organização do apto</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#dados-importantes" onClick={() => setMenuOpen(false)}>Dados importantes</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#midia" onClick={() => setMenuOpen(false)}>Mídia</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#info-apto" onClick={() => setMenuOpen(false)}>Info do Apartamento</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#gatim-info" onClick={() => setMenuOpen(false)}>Informações dos Gatim</a>
                    <a className="toc px-3 py-2 rounded-lg hover:bg-gray-50" href="#checklists" onClick={() => setMenuOpen(false)}>Checklists WhatsApp</a>
                    <button className="toc text-left px-3 py-2 rounded-lg hover:bg-gray-50" onClick={() => { setScheduleOpen(true); setMenuOpen(false) }}>Abrir cronograma</button>
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

          {(visitor === 'Victória') && (
            <details className="mb-2 border border-line rounded-xl bg-white p-3">
              <summary className="cursor-pointer font-bold text-ink">Victória — Domingo (tarde)</summary>
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


        {/* Informações do apartamento */}
        <section id="info-apto" className="my-7">
          <div className="card">
            <h2 className="mb-2 text-xl font-semibold">🏠 Informações do Apartamento</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">📍 Como chegar</h3>
                <p className="text-muted">
                  <b>Rua Hil de Moraes, 12</b><br />
                  Informar na portaria: <b>apto 1812C</b> (liberado no Severino)<br />
                  Pedir acesso informando <b>nome e sobrenome</b>
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div>

                  <h3 className="mb-2 font-semibold">📶 WiFi</h3>
                  <p className="text-muted">
                    <b>WIFI RENAN 5G</b><br />
                    Senha: <code className="kbd">naotemsenha</code>
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">🔐 Senha da porta</h3>
                  <p className="text-muted">
                    <code className="kbd">2580*</code>
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section id="regras" className="my-7">
          <div className="card alert">
            <h2 className="mb-2 text-xl font-semibold">⚠️ Regras de ouro (ATUALIZADO)</h2>
            <ul className="ml-5 mt-2 list-disc">
              <li><b>Nunca</b> deixar Smoke e filhote no mesmo cômodo.</li>
              <li><b>Varanda sempre fechada ao sair do apartamento</b>.</li>
              <li><b>Filhote só pode brincar na sala se a Smoke estiver no quarto</b> (porta do quarto fechada).</li>
              <li><b>Banheiro social travado aberto</b> para a Smoke usar a caixa sem risco de a porta bater.</li>
              <li>
                <b>Porta do escritório</b>
                <span className="relative ml-1 inline-flex items-center group align-middle">
                  <span
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-line bg-white text-[10px] text-ink"
                    aria-label="Mais informações"
                    role="img"
                  >
                    i
                  </span>
                  <span className="absolute left-1/2 top-full z-50 hidden -translate-x-1/2 translate-y-2 whitespace-pre-line rounded-md border border-line bg-white px-3 py-2 text-sm text-ink shadow-card group-hover:block">
                    Gambiarra de leve porque o vento bateu demais a porta e quebrou o alisar. Com um pouco de esforço e levantando pra cima ela fecha hehe :)
                  </span>
                </span>
                : levantar o trinco, empurrar o <i>alisar</i> e puxar a porta até travar.
              </li>
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
            <div className="overflow-x-auto">
              <table className="table min-w-[720px]">
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
          </div>

          <div className="card mt-4">
            <h2 className="mb-2 text-xl font-semibold">🎯 Objetivo por período</h2>
            <ul className="ml-5 list-disc">
              <li>Qui 31/10 tarde → Casa organizada (portas/travas/varanda checadas).</li>
              <li>Sex 01/11 → Felipe mantém rotina e brincadeiras seguras.</li>
              <li>Sáb 02/11 manhã → <b>Loira</b> limpeza com protocolo (ver instruções por pessoa).</li>
              <li>Sáb 02/11 tarde → Elma reforça água, comida e portas.</li>
              <li>Dom 03/11 manhã → Titeco visita; checagem geral.</li>
              <li>Dom 03/11 tarde → Victória visita extra.</li>
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
              <li>Pesar <b>10g</b> de ração (balança branca).</li>
              <li>Misturar até ficar <b>mole, mas não papada</b>; escorrer excesso de água.</li>
              <li>Servir no pratinho dele (ao lado do automático). Pode usar ração do automático para amolecer.</li>
              <li>Ele pode demorar — costuma voltar depois.</li>
            </ol>
          </div>
          <div className="card">
            <h2 className="mb-2 text-xl font-semibold">🧼 Limpeza & Segurança</h2>
            <ul className="ml-5 list-disc">
              <li>Caixa do filhote: <b>escritório</b>.</li>
              <li>Caixa da Smoke: <b>banheiro social</b>.</li>
              <li>Banheiro social: <b>porta travada aberta</b>.</li>
              <li>Depois de limpar o escritório: <b>devolver filhote</b> e <b>fechar bem</b> (trinco + alisar).</li>
            </ul>
          </div>

        </section>

        <section id="limpeza" className="my-7 grid gap-4 md:grid-cols-2">
          <div className="card">
            <h3 className="mb-2 text-lg font-semibold">🌤️ Quando abrir a varanda?</h3>
            <ul className="ml-5 list-disc">
              <li><span className="ok">Pode abrir</span> quando o filhote estiver <b>trancado</b> no escritório.</li>
              <li><span className="warn">Feche sempre</span> com o filhote solto <u>ou</u> ao sair do apartamento.</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="mb-2 text-lg font-semibold">🚑 Sinais de alerta</h3>
            <ul className="ml-5 list-disc">
              <li>Não comer, vômito, diarreia, apatia.</li>
              <li>Briga/arranhões ou tentativa de fuga.</li>
              <li><b>Falar com <a href="https://wa.me/5585996284730" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Renan/Andressa</a></b> e, se preciso, levar ao veterinário.</li>
            </ul>
          </div>
        </section>

        {/* Cronograma vira modal acessado por botão flutuante */}
        {scheduleOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 overflow-y-auto overscroll-contain" onClick={() => setScheduleOpen(false)}>
            <div className="w-full max-w-3xl rounded-2xl border border-line bg-white p-4 shadow-card max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 z-10 flex items-center justify-between bg-white/95 pb-2">
                <h2 className="mb-2 text-xl font-semibold">📅 Cronograma de cuidadores</h2>
                <button className="btn" onClick={() => setScheduleOpen(false)}>Fechar</button>
              </div>
              <table className="table">
                <thead><tr><th>Dia</th><th>Pessoa</th><th>Horário</th><th>Tarefas principais</th></tr></thead>
                <tbody>
                  <tr><td>31/10 (qui)</td><td>Renan</td><td>Saída 15h</td><td>Organizar casa; revisar portas/travas; varanda fechada.</td></tr>
                  <tr><td>01/11 (sex)</td><td>Felipe</td><td>Tarde → noite</td><td>Brincar com filhote; alimentar; ventilação quando no ambiente; separar gatos; <b>fechar varanda ao sair</b>.</td></tr>
                  <tr><td>02/11 (sáb)</td><td>Loira</td><td>08h–13h</td><td>Limpeza do apartamento e cuidado com o filhote.</td></tr>
                  <tr><td>02/11 (sáb)</td><td>Elma</td><td>16h–19h</td><td>Água/comida; brincar com filhote; conferir portas/varanda; <b>fechar varanda ao sair</b>.</td></tr>
                  <tr><td>03/11 (dom)</td><td>Titeco</td><td>10h–12h</td><td>Checar caixas; alimentar; brincar supervisionado; <b>fechar varanda ao sair</b>.</td></tr>
                  <tr><td>03/11 (dom)</td><td>Victória</td><td>Tarde</td><td>Visita extra; rotinas e portas; <b>fechar varanda ao sair</b>.</td></tr>
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
            <ul id="before-exit" className="ml-1 list-none space-y-1">
              {[
                'Filhote no <b>escritório</b>; porta <b>bem fechada</b> (trinco + alisar).',
                'Smoke com acesso ao banheiro social (porta travada aberta).',
                '<b>Varanda fechada.</b>',
                'Água fresca para ambos; comida conforme rotina.',
              ].map((text, i) => {
                const itemId = `before-exit-${i}`
                return (
                  <li key={i} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id={itemId}
                      checked={checkedItems[itemId] || false}
                      onChange={() => toggleChecked(itemId)}
                      className="mt-1 h-4 w-4 cursor-pointer accent-accent"
                    />
                    <label
                      htmlFor={itemId}
                      className={`cursor-pointer flex-1 ${checkedItems[itemId] ? 'line-through text-muted' : ''}`}
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="card">
            <h2 className="mb-2 text-xl font-semibold">📝 Checklist rápido – Durante a visita</h2>
            <ul id="during-visit" className="ml-1 list-none space-y-1">
              {[
                'Conduzir Smoke ao quarto e fechar.',
                'Fechar varanda e soltar filhote na sala (supervisão).',
                'Brincar 20–30 min; preparar ração úmida; repor águas.',
                'Devolver filhote ao escritório e fechar bem.',
                'Reabrir quarto/varanda se ainda ficar no apto.',
              ].map((text, i) => {
                const itemId = `during-visit-${i}`
                return (
                  <li key={i} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id={itemId}
                      checked={checkedItems[itemId] || false}
                      onChange={() => toggleChecked(itemId)}
                      className="mt-1 h-4 w-4 cursor-pointer accent-accent"
                    />
                    <label
                      htmlFor={itemId}
                      className={`cursor-pointer flex-1 ${checkedItems[itemId] ? 'line-through text-muted' : ''}`}
                    >
                      {text}
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* Mídia: vídeos e fotos explicativas (abaixo dos checklists) */}
        <section id="midia" className="my-7">
          <h2 className="mb-3 text-xl font-semibold">🎬 Mídia</h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
            <div className="mb-4 break-inside-avoid ">
              <div className="card min-h-[500px]">
                <h3 className="mb-2 text-lg font-semibold">🎥 Como fechar a porta por dentro</h3>
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-line bg-black min-h-[400px]">
                  <video className="h-full w-full " src="/assets/porta.webm" controls playsInline preload="metadata" />
                </div>
                <p className="mt-2 text-sm text-muted">Dica: é só levantar um pouquinho a porta e ela fecha 😉</p>
              </div>
            </div>

            <div className="mb-4 break-inside-avoid">
              <div className="card">
                <h3 className="mb-2 text-lg font-semibold">🍽️ Comidinha — dois pratinhos</h3>
                <div className="overflow-hidden rounded-xl border border-line bg-white">
                  <img src="/assets/comedouro.webp" alt="Dois pratinhos: automático e o de amolecer com água quente" className="h-auto w-full" />
                </div>
                <p className="mt-2 text-sm text-muted">
                  Esquerda: pratinho da comida automática. Direita: pratinho usado pra amolecer a ração com água quente.
                </p>
              </div>
            </div>

            <div className="mb-4 break-inside-avoid">
              <div className="card">
                <h3 className="mb-2 text-lg font-semibold">🖼️ Caixas e cordinha</h3>
                <div className="overflow-hidden rounded-xl border border-line bg-white">
                  <img src="/assets/caixas_porta.webp" alt="Caixas na porta e cordinha de segurança" className="h-auto w-full" />
                </div>
                <p className="mt-2 text-sm text-muted">
                  Essas caixas impedem o filhote de sair sem precisar fechar as portas do banheiro (mantém o vento circulando).
                  A cordinha evita que o vento feche a porta do banheiro — gambis inteligente!
                </p>
              </div>
            </div>
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
        <p>Emergências: falar com <a href="https://wa.me/5585996284730" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:no-underline">Renan ou Andressa</a>. Em sinais clínicos (apatia, diarreia, vômito, recusa alimentar), acionar veterinário.</p>
      </footer>
    </>
  )
}



