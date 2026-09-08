import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Tag,
  Sparkles,
  FileText
} from 'lucide-react';

export default function KnowledgeBase({ articles, onAddArticle }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for new article
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('API & Developers');
  const [newSnippet, setNewSnippet] = useState('');
  const [newTags, setNewTags] = useState('support, help');

  const categories = ['All', 'API & Developers', 'Billing', 'Workspace', 'Security'];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch = art.title.toLowerCase().includes(search.toLowerCase()) || 
                          art.snippet.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateArticle = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSnippet.trim()) return;

    const newDoc = {
      id: `KB-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      category: newCategory,
      snippet: newSnippet,
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'Indexed',
      views: 1,
      tags: newTags.split(',').map((t) => t.trim())
    };

    onAddArticle(newDoc);
    setNewTitle('');
    setNewSnippet('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto h-full">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            RAG Knowledge Base & Vector Store
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Documents indexed here serve as context groundings for AI auto-responses and semantic search.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            Re-index Vector Embeddings
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            Add Knowledge Article
          </button>
        </div>
      </div>

      {/* Search & Filter Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search knowledge documents or vector tags..."
            className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center text-slate-400 space-y-3">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No Knowledge Base Articles Found</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click "Add Knowledge Article" above to create and index your first documentation article for AI retrieval.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-5 transition-all flex flex-col justify-between group shadow-sm hover:shadow-indigo-500/5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-indigo-400">{art.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {art.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors mb-2">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {art.snippet}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {art.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5 text-indigo-400" /> {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> Updated {art.updatedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-slate-500" /> {art.views} views
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding article */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Add Knowledge Article to Vector Store
            </h3>

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Setting up Webhook Subscriptions"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                >
                  <option>API & Developers</option>
                  <option>Billing</option>
                  <option>Workspace</option>
                  <option>Security</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Content / Document Snippet</label>
                <textarea
                  required
                  rows={4}
                  value={newSnippet}
                  onChange={(e) => setNewSnippet(e.target.value)}
                  placeholder="Paste the documentation text that AI will reference for answering customer tickets..."
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-lg p-3 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="api, webhooks, setup"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  Save & Index Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
