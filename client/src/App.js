import React, { useState } from 'react';
import './App.css';

const ROWS = 8;
const COLS = 14;

const MOVIES = [
  { title: 'Oppenheimer', price: 12 },
  { title: 'Inception', price: 10 },
  { title: 'The Batman', price: 11 },
  { title: 'Interstellar', price: 13 },
  { title: 'Joker', price: 9 },
  { title: 'Avengers: Endgame', price: 14 }
];

const createInitialSeats = () => {
  const brokenSeatsSet = new Set();
  while (brokenSeatsSet.size < 5) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    brokenSeatsSet.add(`${row}-${col}`);
  }

  const seats = [];
  for (let i = 0; i < ROWS; i++) {
    const row = [];
    for (let j = 0; j < COLS; j++) {
      const id = `${i}-${j}`;
      const isBroken = brokenSeatsSet.has(id);
      row.push({
        id,
        status: isBroken ? 'broken' : 'available',
        type:
          (i === 0 && j >= 2 && j <= 3) || (i === 1 && j >= 6 && j <= 7)
            ? 'vip'
            : (i === 2 && (j === 0 || j === 9)) || (i === 3 && (j === 0 || j === 9))
            ? 'accessible'
            : (i === 4) ? 'no-children' : 'standard',
        owner: null
      });
    }
    seats.push(row);
  }
  return seats;
};

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('signin');
  const [authData, setAuthData] = useState({ username: '', password: '', userType: 'user' });

  const [seats, setSeats] = useState(createInitialSeats());
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [groupSize, setGroupSize] = useState(1);
  const [userType, setUserType] = useState('user');
  const [selectedMovie, setSelectedMovie] = useState(MOVIES[0]);
  const [showSummary, setShowSummary] = useState(false);
  const [bookingSummary, setBookingSummary] = useState(null);

  const isAdmin = userType === 'admin';
  const isSenior = userType === 'senior';

  const isSeatDisabled = (rowIndex, seatIndex) => {
    const seat = seats[rowIndex][seatIndex];
    if (isAdmin || isSenior) return false;
    if (seat.status === 'booked' || seat.status === 'broken') return true;
    if (seat.type === 'vip' && userType !== 'vip') return true;
    if (seat.type === 'accessible' && userType !== 'accessible' && userType !== 'vip') return true;
    if (seat.type === 'no-children' && userType === 'child') return true;
    return false;
  };

  const handleSelectSeats = (rowIndex, seatIndex) => {
    const selected = [];
    for (let i = seatIndex; i < seatIndex + groupSize; i++) {
      if (
        i >= COLS ||
        (!isAdmin && seats[rowIndex][i].status === 'booked') ||
        isSeatDisabled(rowIndex, i)
      ) {
        return;
      }
      selected.push(`${rowIndex}-${i}`);
    }
    setSelectedSeats(selected);
  };

  const confirmBooking = () => {
    const updatedSeats = seats.map((row, i) =>
      row.map((seat, j) => {
        const id = `${i}-${j}`;
        if (selectedSeats.includes(id)) {
          return {
            ...seat,
            status: 'booked',
            owner: userType
          };
        }
        return seat;
      })
    );
    setSeats(updatedSeats);

    const summary = {
      ticketType: userType,
      seats: selectedSeats,
      pricePerTicket: selectedMovie.price,
      total: selectedSeats.length * selectedMovie.price
    };
    setBookingSummary(summary);
    setShowSummary(true);
    setSelectedSeats([]);
    alert('Booking confirmed!');
  };

  const totalPrice = selectedSeats.length * selectedMovie.price;

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authData.username || !authData.password) {
      alert('Please fill in all fields');
      return;
    }
    setUser(authData.username);
    setUserType(authData.userType);
  };

  if (!user) {
    return (
      <div className="auth-container">
        <h2>{authMode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
        <form onSubmit={handleAuthSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={authData.username}
            onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={authData.password}
            onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
            required
          />
          <select
            value={authData.userType}
            onChange={(e) => setAuthData({ ...authData, userType: e.target.value })}
          >
            <option value="user">User</option>
            <option value="vip">VIP</option>
            <option value="accessible">Disability</option>
            <option value="senior">Senior</option>
            <option value="child">Child</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">{authMode === 'signin' ? 'Sign In' : 'Sign Up'}</button>
        </form>
        <p>
          {authMode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button className="link-button" onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}>
            {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Cinema Seating Prototype</h1>
      <div className="controls">
        <label>User Type: </label>
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="user">User</option>
          <option value="vip">VIP</option>
          <option value="accessible">Disability</option>
          <option value="senior">Senior</option>
          <option value="child">Child</option>
          <option value="admin">Admin</option>
        </select>
        <label>Group Size (1–7): </label>
        <input
          type="number"
          min="1"
          max="7"
          value={groupSize}
          onChange={(e) => setGroupSize(Number(e.target.value))}
        />
        <label>Movie: </label>
        <select value={selectedMovie.title} onChange={(e) => setSelectedMovie(MOVIES.find(m => m.title === e.target.value))}>
          {MOVIES.map((movie) => (
            <option key={movie.title} value={movie.title}>
              {movie.title} (£{movie.price})
            </option>
          ))}
        </select>
        <div>Total Price: £{totalPrice}</div>
        <div>
          Welcome, {user}!
          <button className="logout-button" onClick={() => { setUser(null); setAuthData({ username: '', password: '', userType: 'user' }); }}>
            Logout
          </button>
        </div>
      </div>

      <div className="legend">
        <div><span className="seat vip"></span> VIP</div>
        <div><span className="seat accessible"></span> Accessible</div>
        <div><span className="seat no-children"></span> No Children</div>
        <div><span className="seat broken"></span> Broken</div>
        <div><span className="seat booked user"></span> Booked (User)</div>
        <div><span className="seat booked vip"></span> Booked (VIP)</div>
        <div><span className="seat booked accessible"></span> Booked (Disability)</div>
        <div><span className="seat booked admin"></span> Booked (Admin)</div>
        <div><span className="seat selected"></span> Selected</div>
      </div>

      <div className="seating">
        {seats.map((row, i) => (
          <div key={i} className="row">
            {row.map((seat, j) => {
              const id = `${i}-${j}`;
              const isSelected = selectedSeats.includes(id);
              const isDisabled = isSeatDisabled(i, j);
              const baseClass =
                seat.status === 'booked'
                  ? `seat booked ${seat.owner}`
                  : seat.status === 'broken'
                  ? 'seat broken'
                  : `seat available ${seat.type}`;
              const className = `${baseClass} ${isSelected ? 'selected' : ''}`;
              return (
                <button
                  key={id}
                  className={className}
                  onClick={() => handleSelectSeats(i, j)}
                  disabled={!isSelected && isDisabled}
                >
                  {j + 1}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <button
        onClick={confirmBooking}
        disabled={!selectedSeats.length}
        className="confirm-button"
      >
        {isAdmin ? 'Assign Seats' : 'Confirm Booking'}
      </button>

      {showSummary && bookingSummary && (
        <div className="modal">
          <div className="modal-content">
            <h2>Booking Summary</h2>
            <p><strong>Ticket Type:</strong> {bookingSummary.ticketType}</p>
            <p><strong>Seats:</strong> {bookingSummary.seats.join(', ')}</p>
            <p><strong>Price per Ticket:</strong> £{bookingSummary.pricePerTicket}</p>
            <p><strong>Total:</strong> £{bookingSummary.total}</p>
            <button onClick={() => setShowSummary(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
