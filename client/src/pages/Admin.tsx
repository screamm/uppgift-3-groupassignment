import "../styles/admin.css"

export const Admin = () => {
    return(
        <div className="admin">
            <h2>Produktlista</h2>
            <div>
                    <div>
                        <h6>Artikelnamn: </h6>
                        <input
                            type="text"
                     />
                        <label>Pris: </label>
                        <input
                           type="text"
                     />
                        <button>Spara</button>
                    </div>
                    <div>
                        <h1>Prenumerationer</h1>
                         <p>Artikelpris:  kr</p>
                         <button>Redigera Prenumeration</button>
                    </div>
            </div>
            <div>
                <label>Artikelnamn: </label>
                    <input
                         type="text"
                    />
                    <label>Pris: </label>
                    <input
                     type="text"
                    />
                    <button>Spara</button>
            </div>
                <button>Lägg till artikel</button>
                <p>Artikeln har lagts till!</p>
        </div>

    );
};