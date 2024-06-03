import "../styles/contact.css";
import img3 from "../img/lvl3.png";

export const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contact</h1>
      <p>123-456-789</p>
      <p>alpacaforlife@alpacanews.com</p>
      <h2>About Alpaca News</h2>
      <p>
        Alpaca News is your source for the latest in <br />
        alpaca-related news, articles, and events. <br />
        We strive to keep you informed about everything <br />
        happening in the world of alpacas!
      </p>
      <img src={img3} alt="Product Image" style={{ width: "300px" }} />
    </div>
  );
};
