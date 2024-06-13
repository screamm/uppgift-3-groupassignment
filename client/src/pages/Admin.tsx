// TEST
import "../styles/admin.css";
import { useState, useEffect } from "react";
import { IProduct, IArticle } from "../models/Article";

export const Admin = () => {
    const [articles, setArticles] = useState<IProduct[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedArticle, setSelectedArticle] = useState<IProduct | null>(null);
    const [contentPages, setContentPages] = useState<IArticle[]>([]);
    const [newArticleName, setNewArticleName] = useState<string>('');
    const [newArticleText, setNewArticleText] = useState<string>('');
    const [selectedSubscription, setSelectedSubscription] = useState<string>("Alpaca Basic"); 
    const subscriptions = ["Alpaca Basic", "Alpaca Insight", "Alpaca Elite"]; // Vilka nivåer man kan välja mellan till innehållsidorna.

    useEffect(() => {
        setIsLoading(true);
        fetch("http://localhost:3000/articles/products")
            .then((response) => response.json())
            .then((data) => {
                setArticles(data.reverse());
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching articles:", error);
                setIsLoading(false);
            });

        fetch("http://localhost:3000/articles/articles")
            .then((response) => response.json())
            .then((data) => {
                console.log('articles: ', data);
                
                setContentPages(data.default);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching content pages:", error);
                setIsLoading(false);
            });
    }, []);

    const handleEditClick = (article: IProduct) => {
        setSelectedArticle(article);
    }

    const handleSaveClick = async () => {
        // Implementera uppdatering av prenumeration här
    }

    const handleAddPageClick = async () => {
        try {
            const newPageData = {
                title: newArticleName,
                description: newArticleText,
                level: selectedSubscription // Använd vald prenumeration nivå
            };

            console.log('new page data: ', newPageData);            

            const response = await fetch(`http://localhost:3000/articles/articles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPageData)
            });

            if (!response.ok) {
                throw new Error(`Failed to add content page: ${response.statusText}`);
            }

            const updatedPagesResponse = await fetch("http://localhost:3000/content/pages");
            const updatedPagesData = await updatedPagesResponse.json();
            setContentPages(updatedPagesData);

            setNewArticleName('');
            setNewArticleText('');

            console.log("Sidans innehåll har lagts till!");
        } catch (error) {
            console.error("Error adding content page:", error);
        }
    };

    return (
        <div className="admin">
            <h2>Subscription List</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="adminSubscriptionList">
                    {articles.map((article, index) => (
                        <div key={index} className="subscription">
                            {selectedArticle && selectedArticle._id === article._id ? (
                                <div>
                                    <input
                                        type="text"
                                        value={selectedArticle.name}
                                        onChange={e => setSelectedArticle({...selectedArticle, name: e.target.value})}
                                    />
                                    <label>Pris: </label>
                                    <input
                                        type="text"
                                        value={selectedArticle.price}
                                        onChange={e => setSelectedArticle({...selectedArticle, price: parseFloat(e.target.value)})}
                                    />
                                    <button onClick={handleSaveClick}>Spara</button>
                                </div>
                            ) : (
                                <div>
                                    <h1>{article.name}</h1>
                                    <p>Subscription Price: {article.price} kr</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <h2>Articles</h2>
            
            <div className="adminContentPages">
                {contentPages.map((page, index) => (
                    <div key={index} className="contentPage">
                        <h3>{page.title}</h3>
                        <p>Level: {page.level}</p> {/* Visa prenumerationen baserat på krävd nivå */}
                        <p>{page.description}</p>
                    </div>
                ))}
                <div className="addContentPageForm">
                    <form onSubmit={handleAddPageClick}>
                        <label>Article Name: </label>
                        <input
                            type="text"
                            value={newArticleName}
                            onChange={e => setNewArticleName(e.target.value)}
                        />
                        <label>Text: </label>
                        <textarea value={newArticleText} onChange={e => setNewArticleText(e.target.value)} cols={20} rows={5}/>
                        <label>Choose Subscription: </label>
                        <select value={selectedSubscription} onChange={(e) => setSelectedSubscription((e.target.value))}>
                            {subscriptions.map((subscription, index) => (
                                <option key={index} value={subscription}>{subscription}</option>
                            ))}
                        </select>
                        <button type="submit">Add Article</button>                        
                    </form>
                </div>
            </div>
        </div>
    );
};