import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = "https://sigurnost-app.onrender.com/api";

export default function SensitiveDataDemo() {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [enabled, setEnabled] = useState(true);

    const fetchUsers = async () => {
        const res = await axios.get(`${API}/users`);
        setUsers(res.data);
    };

    const register = async () => {
        await axios.post(`${API}/users/register`, { username, password })
        .then(res => console.log(res.data))
        .catch(err => console.error(err));
        setUsername(''); setPassword('');
        fetchUsers();
    };

    const toggleVuln = async () => {
        await axios.post(`${API}/users/toggle-storage`, { enabled: !enabled });
        setEnabled(!enabled);
    };

    useEffect(() => { fetchUsers(); }, []);

    return (
        <div>
            <div>
                <p><strong>Upute: </strong>Ako je ranjivost uključena, lozinke se spremaju u čistom tekstu i moguće je demonstrirati napade i propuste. Ako je ranjivost isključena koristi se bcrypt (salt + hash) pa su lozinke sigurno pohranjene.</p>
                <p><strong>Cilj: </strong>Demonstrirati razliku između nesigurne i sigurne pohrane te prikazati zašto je potrebno hashirati lozinke.</p>
                <p><strong>Tablica: </strong>Prikaz pohrane podataka u bazi.</p>
            </div>
            <label>
                <input type="checkbox" checked={enabled} onChange={toggleVuln} /> Ranjivost uključena
            </label>
            <div>
                <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button onClick={register}>Registriraj</button>
            </div>
            <div>
                <h3>Prikaz pohrane podataka korisnika:</h3>
                {users.map(u => <div key={u.id}>{u.username} : {u.password}</div>)}
            </div>
        </div>
    );
}
