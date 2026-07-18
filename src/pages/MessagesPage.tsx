import { useEffect, useRef, useState } from 'react';
import { NativeEmoji } from '../components/NativeEmoji';
import { SectionTitle } from '../components/SectionTitle';
import {
  addMessage,
  deleteMessage,
  fetchMessages,
  type Message,
} from '../utils/messages';

const authors = ['Yasmine', 'Amine'] as const;
const authorStorageKey = 'her-message-author';

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [author, setAuthor] = useState<string>(authors[0]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(authorStorageKey);
    if (saved && (authors as readonly string[]).includes(saved)) {
      setAuthor(saved);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load(initial: boolean) {
      try {
        const data = await fetchMessages();
        if (!cancelled) {
          setMessages(data);
          setErrorMessage('');
        }
      } catch {
        if (!cancelled && initial) {
          setErrorMessage(
            'Espace momentanement indisponible. Verifie ta connexion.',
          );
        }
      } finally {
        if (!cancelled && initial) {
          setIsLoading(false);
        }
      }
    }

    void load(true);

    // Rafraichissement doux tant que la page est visible (effet "en direct").
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void load(false);
      }
    }, 7000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  function chooseAuthor(next: string) {
    setAuthor(next);
    window.localStorage.setItem(authorStorageKey, next);
  }

  async function handleSend() {
    const value = text.trim();
    if (!value || isSending) {
      return;
    }

    setIsSending(true);
    setErrorMessage('');

    try {
      const created = await addMessage(author, value);
      setMessages((previous) => [...previous, created]);
      setText('');
    } catch {
      setErrorMessage("Le message n a pas pu etre envoye. Reessaie.");
    } finally {
      setIsSending(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Supprimer ce message pour vous deux ?')) {
      return;
    }

    try {
      await deleteMessage(id);
      setMessages((previous) => previous.filter((message) => message.id !== id));
    } catch {
      setErrorMessage('La suppression a echoue. Reessaie.');
    }
  }

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Rien qu a nous"
        title="Notre petit espace"
        description="Un endroit rien que pour vous deux : laisse un mot, une pensee, ce que tu as sur le coeur. Tout reste ici, visible par vous deux."
      />

      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        {/* Qui ecrit */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-beige/60">
            J ecris :
          </span>
          {authors.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => chooseAuthor(name)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                author === name ? 'btn-gold' : 'btn-outline-gold'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Fil de messages */}
        <div className="glass-card min-h-[320px] p-4 sm:p-6">
          {isLoading ? (
            <p className="py-10 text-center text-sm text-beige/60">
              Chargement de vos mots…
            </p>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <NativeEmoji symbol="🐾" label="Empreinte" className="text-2xl opacity-70" />
              <p className="text-sm text-beige/70">
                Aucun mot pour l instant. Ecris le premier.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((message) => {
                const mine = message.auteur === author;
                return (
                  <div
                    key={message.id}
                    className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`group relative max-w-[80%] rounded-2xl px-4 py-3 shadow-card ${
                        mine
                          ? 'rounded-br-sm bg-gold-cta text-noir'
                          : 'rounded-bl-sm border border-gold/20 bg-noir/50 text-ivory'
                      }`}
                    >
                      <p
                        className={`mb-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] ${
                          mine ? 'text-noir/60' : 'text-gold'
                        }`}
                      >
                        {message.auteur} · {formatDate(message.cree_le)}
                      </p>
                      <p className="whitespace-pre-wrap text-[15px] leading-6">
                        {message.texte}
                      </p>
                      <button
                        type="button"
                        onClick={() => void handleDelete(message.id)}
                        className={`absolute -top-2 ${
                          mine ? '-left-2' : '-right-2'
                        } flex h-6 w-6 items-center justify-center rounded-full border border-gold/30 bg-noir/80 text-[11px] text-beige opacity-0 transition group-hover:opacity-100 focus:opacity-100 focus-visible:outline-none`}
                        aria-label="Supprimer ce message"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Zone d ecriture */}
        <div className="glass-card p-3 sm:p-4">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value.slice(0, 1000))}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                void handleSend();
              }
            }}
            placeholder={`Ecris quelque chose, ${author}…`}
            rows={3}
            className="w-full resize-none rounded-[1rem] border border-gold/20 bg-noir/50 px-4 py-3 text-[16px] leading-6 text-ivory outline-none transition placeholder:text-beige/35 focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-beige/45" aria-live="polite">
              {errorMessage || `${text.length}/1000`}
            </span>
            <button
              type="button"
              disabled={isSending || text.trim().length === 0}
              onClick={() => void handleSend()}
              className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-noir"
            >
              <NativeEmoji symbol="✨" label="Envoyer" className="text-sm" />
              {isSending ? 'Envoi…' : 'Envoyer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
