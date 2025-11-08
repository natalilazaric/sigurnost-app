import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

export default function XSSDemo() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [enabled, setEnabled] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const executeInlineScript = (elem) => {
    if (!elem) return;

    const scripts = elem.querySelectorAll('script');
    scripts.forEach(oldScript => {
      if (oldScript.dataset.executed) return;

      const newScript = document.createElement('script');

      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.text = oldScript.textContent;
      }

      for (let i = 0; i < oldScript.attributes.length; i++) {
        const attr = oldScript.attributes[i];
        if (attr.name === 'data-executed') continue;
        newScript.setAttribute(attr.name, attr.value);
      }

      newScript.setAttribute('data-executed', 'true');
      try {
        oldScript.parentNode.replaceChild(newScript, oldScript);
      } catch (e) {
        console.error('Ne mogu zamijeniti script element:', e);
      }
    });
  };

  useEffect(() => {
    if (!enabled) return;

    requestAnimationFrame(() => {
      document.querySelectorAll('.message-rendered').forEach(elem => {
        if (elem.dataset.executedOnce) return;
        executeInlineScript(elem);
        elem.dataset.executedOnce = 'true';
      });
    });
  }, [messages, enabled]);

  const addMessage = async () => {
    if (!content) return;
    try {
      const res = await axios.post(`${API}/messages`, { content });
      const newMessage = res.data;

      setMessages(prev => [...prev, newMessage]);
      setContent('');

      requestAnimationFrame(() => {
        const elem = document.querySelector(`.message[data-id="${newMessage.id}"]`);
        if (elem) {
          executeInlineScript(elem);

        }
      });

    } catch (err) {
      console.error(err);
    }
  };

  const toggleVuln = async () => {
    try {
      await axios.post(`${API}/messages/toggle-xss`, { enabled: !enabled });
      setEnabled(!enabled);
      await fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <div>
        <p><strong>Upute: </strong>Ako je ranjivost uključena napadi se izvršavaju, prikazuju na stranici i pohranjuju u nesanitiziranom obliku u bazu. Ako je ranjivost isključena napadi se ne izvršavaju, aplikacija sanitizira uneseni tekst te sanitizirani oblik pohranjuje u bazu.</p>
        <p><strong>Cilj: </strong>Demonstrirati rizik XSS napada i pokazati zašto je potrebno pravilno sanitizirati korisnički unos prije prikaza.</p>
        <p><strong>Tablica: </strong>Prikaz unesenih napada, lijevi stupac sadrži prikaz na stranici, dok desni stupac prikazuje pohranu teksta napada u bazi.</p>
      </div>
      <label>
        <input type="checkbox" checked={enabled} onChange={toggleVuln} /> Ranjivost uključena
      </label>

      <div style={{ marginTop: 10 }}>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Unesi poruku"
          style={{ width: '60%' }}
        />
        <button onClick={addMessage} style={{ marginLeft: 8 }}>Pošalji</button>
        <button onClick={fetchMessages} style={{ marginLeft: 8 }}>Refresh</button>
      </div>

      
      <div style={{ marginTop: 20 }}>
        <h3>Prikaz napada:</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginTop: '12px',
            alignItems: 'start',
          }}
        >
          <div style={{ fontWeight: 'bold', textAlign: 'center' }}>Prikaz na stranici</div>
          <div style={{ fontWeight: 'bold', textAlign: 'center' }}>Pohrana u bazi podataka</div>

          {messages.map((m) => (
            <React.Fragment key={m.id}>
              {enabled ? (
                <div
                  className="message-rendered"
                  data-id={m.id}
                  dangerouslySetInnerHTML={{ __html: m.content }}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    padding: 8,
                    background: '#fff',
                    minHeight: 40,
                    wordWrap: 'break-word',
                  }}
                />
              ) : (
                <div
                  className="message-rendered"
                  data-id={m.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    padding: 8,
                    background: '#fff',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    maxHeight: 160,
                    wordWrap: 'break-word',
                  }}
                >
                  {m.content}
                </div>
              )}

              <pre
                style={{
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  padding: 8,
                  background: '#f7f7f7',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: 160,
                  overflow: 'auto',
                }}
              >
                {m.content}
              </pre>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
