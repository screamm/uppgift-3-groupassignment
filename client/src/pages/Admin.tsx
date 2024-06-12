// TEST
import "../styles/admin.css";
import React, { useState, useEffect } from "react";
import { IProduct } from "../models/Article";

export const Admin = () => {
    const [articles, setArticles] = useState<IProduct[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedArticle, setSelectedArticle] = useState<IProduct | null>(null);
    const [contentPages, setContentPages] = useState<{ name: string; requiredLevel: number }[]>([]);
    const [newPageName, setNewPageName] = useState<string>('');
    const [selectedSubscription, setSelectedSubscription] = useState<number>(1); 
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

        fetch("http://localhost:3000/content/pages")
            .then((response) => response.json())
            .then((data) => {
                setContentPages(data);
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
                name: newPageName,
                requiredLevel: selectedSubscription // Använd vald prenumeration nivå
            };

            const response = await fetch(`http://localhost:3000/content/pages`, {
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

            setNewPageName('');

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
                                    <h6 className="subscriptionName">Prenumerationsnamn: </h6>
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
                                    <button onClick={() => handleEditClick(article)} className="editArticle">Edit the subscription</button>
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
                        <h3>{page.name}</h3>
                        <p>Level: {subscriptions[page.requiredLevel - 1]}</p> {/* Visa prenumerationen baserat på krävd nivå */}
                    </div>
                ))}
                <div className="addContentPageForm">
                    <label>Article Name: </label>
                    <input
                        type="text"
                        value={newPageName}
                        onChange={e => setNewPageName(e.target.value)}
                    />
                    <label>Text: </label>
                    <input
                        type="text"
                    />
                    <label>Choose Subscription: </label>
                    <select value={selectedSubscription} onChange={(e) => setSelectedSubscription(parseInt(e.target.value))}>
                        {subscriptions.map((subscription, index) => (
                            <option key={index} value={index + 1}>{subscription}</option>
                        ))}
                    </select>
                    <button onClick={handleAddPageClick}>Add Article</button>
                </div>
            </div>
        </div>
    );
};