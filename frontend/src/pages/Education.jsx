import { BookOpen, Video, FileText } from 'lucide-react';

const Education = () => {
  const articles = [
    { title: 'Stock Market Basics for Beginners', type: 'Article', icon: <FileText className="text-blue-500" />, desc: 'Learn the fundamentals of how the stock market works, what shares are, and how prices are determined.' },
    { title: 'Understanding Portfolio Diversification', type: 'Guide', icon: <BookOpen className="text-green-500" />, desc: 'Why putting all your eggs in one basket is dangerous. Learn how to spread risk.' },
    { title: 'Technical vs Fundamental Analysis', type: 'Video', icon: <Video className="text-purple-500" />, desc: 'A quick breakdown of the two main strategies used to evaluate investments and find trading opportunities.' },
    { title: 'The Psychology of Trading', type: 'Article', icon: <FileText className="text-blue-500" />, desc: 'How to manage emotions like fear and greed to become a successful long-term investor.' }
  ];

  return (
    <div className="education-page animate-fade-in">
      <div className="dashboard-header mb-6">
        <div>
          <h2>Educational Resources</h2>
          <p>Enhance your trading knowledge and skills.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <div key={index} className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              {article.icon}
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="badge badge-success">{article.type}</span>
              </div>
              <h3 className="mb-2" style={{fontSize: '1.2rem'}}>{article.title}</h3>
              <p className="text-muted" style={{fontSize: '0.9rem'}}>{article.desc}</p>
              <button className="btn btn-primary btn-sm mt-4">Read More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
