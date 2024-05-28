import "../styles/home.css";
import img1 from "../img/np1.png";
import img2 from "../img/np2.png";
import img3 from "../img/np3.png";

export const Home = () => {
  return (
    <>
      <h1>TITLE</h1>
      <div className="container">
        <div className="subscriptionBox">
          <img src={img1} alt="Product Image" />
          <h2>NEWS SITE</h2>
          <h3>1 kr</h3>
          <p>
            2 months for 1 kr then 50% off for 3 months. After that, regular
            price 149 kr/month. No commitment.
          </p>
          <ul>
            <li>
              <i className="fas fa-check-square"></i>Access to all articles on
              gp.se and in the news app
            </li>
            <li>
              <i className="fas fa-check-square"></i>E-newspaper all week - our
              digital version of the paper newspaper
            </li>
            <li>
              <i className="fas fa-check-square"></i>Share your subscription
              with 4 family members
            </li>
            <li>
              <i className="fas fa-check-square"></i>Crosswords and Sudoku
            </li>
            <li>
              <i className="fas fa-check-square"></i>Paper newspaper - choose
              between weekend or all week
            </li>
          </ul>
          <button className="button">GET STARTED</button>
        </div>
        <div className="subscriptionBox">
          <img src={img2} alt="Product Image" />
          <h2>DIGITAL</h2>
          <h3>49 kr</h3>
          <p>First month, then 299 kr/month. No commitment.</p>
          <ul>
            <li>
              <i className="fas fa-check-square"></i>Access to all articles on
              gp.se and in the news app
            </li>
            <li>
              <i className="fas fa-check-square"></i>E-newspaper all week - our
              digital version of the paper newspaper
            </li>
            <li>
              <i className="fas fa-check-square"></i>Share your subscription
              with 4 family members
            </li>
            <li>
              <i className="fas fa-check-square"></i>Crosswords and Sudoku
            </li>
            <li>
              <i className="fas fa-check-square"></i>Paper newspaper - choose
              between weekend or all week
            </li>
          </ul>
          <button className="button">GET STARTED</button>
        </div>
        <div className="subscriptionBox">
          <img src={img3} alt="Product Image" />
          <h2>DIGITAL & PAPER</h2>
          <h3>From 449 kr</h3>
          <p>
            In the next step, choose how often you want to receive the
            newspaper. No commitment.
          </p>
          <ul>
            <li>
              <i className="fas fa-check-square"></i>Access to all articles on
              gp.se and in the news app
            </li>
            <li>
              <i className="fas fa-check-square"></i>E-newspaper all week - our
              digital version of the paper newspaper
            </li>
            <li>
              <i className="fas fa-check-square"></i>Share your subscription
              with 4 family members
            </li>
            <li>
              <i className="fas fa-check-square"></i>Crosswords and Sudoku
            </li>
            <li>
              <i className="fas fa-check-square"></i>Paper newspaper - choose
              between weekend or all week
            </li>
          </ul>
          <button className="button">GET STARTED</button>
        </div>
      </div>
    </>
  );
};

export default Home;
