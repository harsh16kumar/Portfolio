import { useState, useEffect } from 'react';
import { Newspaper, Loader2, ExternalLink } from 'lucide-react';
import './NewsPanel.css';

export default function NewsPanel() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  // Scroll listener to hide the panel permanently after user scrolls
  useEffect(() => {
    const handleScroll = () => {
      // Direct DOM manipulation for true 0ms latency, bypassing React's render cycle
      if (window.scrollY > 1 && isVisible) {
        const panel = document.getElementById('ai-news-panel');
        if (panel) panel.style.display = 'none';
        setIsVisible(false);
      } else if (window.scrollY <= 1 && !isVisible) {
        const panel = document.getElementById('ai-news-panel');
        if (panel) panel.style.display = ''; // Restore display
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  // Fetch from Tavily API on mount
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = import.meta.env.VITE_TAVILY_API_KEY;
        if (!apiKey) {
          throw new Error("Tavily API key is missing from environment variables.");
        }

        const response = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            api_key: apiKey,
            query: "Give latest news and popular one related to ai or ml or deep learning or image generation or video geenration or models new llms anything",
            topic: "news",
            search_depth: "advanced",
            time_range: "week",
            max_results: 15
          })
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        // data.results should contain the array of news items
        if (data && data.results) {
          setNews(data.results);
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (!isVisible) return null; // Unmount completely once hidden

  return (
    <div id="ai-news-panel" className={`news-panel ${!isVisible ? 'hidden' : ''}`}>
      <div className="news-content">
        {loading ? (
          <div className="news-loading">
            <Loader2 size={24} className="spin-icon" />
            <p>Scanning the web for AI breakthroughs...</p>
          </div>
        ) : error ? (
          <div className="news-error">
            <p>Could not load the latest news at this time.</p>
          </div>
        ) : news.length === 0 ? (
          <div className="news-empty">
            <p>No major updates found this week!</p>
          </div>
        ) : (
          <div className="news-marquee-container">
            <div className="news-marquee">
              <div className="news-list">
                {news.map((item, index) => (
                  <a 
                    key={index} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="news-item"
                  >
                    <div className="news-item-content">
                      <h4>{item.title}</h4>
                    </div>
                    <ExternalLink size={14} className="news-link-icon" />
                  </a>
                ))}
              </div>
              <div className="news-list" aria-hidden="true">
                {news.map((item, index) => (
                  <a 
                    key={`dup-${index}`} 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="news-item"
                  >
                    <div className="news-item-content">
                      <h4>{item.title}</h4>
                    </div>
                    <ExternalLink size={14} className="news-link-icon" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
