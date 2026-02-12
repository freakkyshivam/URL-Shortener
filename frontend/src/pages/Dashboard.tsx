import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as LinkIcon, Plus, Copy, ExternalLink } from 'lucide-react';
import { SignedIn,  UserButton } from '@clerk/clerk-react';
 
import { api } from '../lib/api';

interface User {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
}

interface Url {
  id: string;
  shortCode: string;
  targetUrl: string;
  clicks: number;
  createdAt: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [urls, setUrls] = useState<Url[]>([]);
  const [formData, setFormData] = useState({
    url: '',
    code: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL

  console.log(BASE_URL);
  
  useEffect(() => {
    fetchUserInfo();
    fetchUrls();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get(`/api/user`,{
        withCredentials : true
      });
      if (response.data.id) {
        setUser(response.data);
      }  
    } catch (err) {
      console.error(err)
      
    }
  };

  const fetchUrls = async () => {
    try {
      const {data} = await api.get(`/api/user/urls`,{
        withCredentials : true
      });
      
      console.log(data);
      
      if (data.success) {
        setUrls(data.urls);
      }
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post(`/shorten`, formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        setSuccess('URL shortened successfully!');
        setFormData({ url: '', code: '' });
        fetchUrls(); // Refresh the list
      } else {
        setError(response.data.msg || 'Failed to shorten URL');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err)
    } finally {
      setIsLoading(false);
    }
  };

 

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this URL?')) return;

    try {
      const response = await api.delete(`/url/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setSuccess('URL deleted successfully!');
        fetchUrls(); // Refresh the list
      } else {
        setError(response.data.msg || 'Failed to delete URL');
      }
    } catch (err) {
      console.error(err)
      setError('Network error. Please try again.');
    }
  };

  console.log(urls);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div
            onClick={()=>navigate('/')}
            className="flex items-center space-x-2 cursor-pointer">
              <LinkIcon className="h-8 w-8 text-indigo-400" />
              <span className="text-2xl font-bold text-white">ShortLink</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {(user as User)?.firstName}!</span>
               <SignedIn>
              <UserButton />
            </SignedIn>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Success/Error Messages */}
        {error && (
          <div className="mb-4 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        {/* Create URL Form */}
        <div className="bg-gray-800 shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-white mb-4">Create Short URL</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-300">
                Original URL
              </label>
              <input
                type="url"
                id="url"
                name="url"
                required
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com"
                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-300">
                Custom Code (optional)
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Leave empty for auto-generated code"
                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? 'Creating...' : 'Create Short URL'}
            </button>
          </form>
        </div>

        {/* URLs List */}
        <div className="bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-white mb-4">Your Short URLs</h3>
            {urls?.length === 0 ? (
              <div className="text-center py-12">
                <LinkIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-white">No URLs yet</h3>
                <p className="mt-1 text-sm text-gray-400">Create your first short URL above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {urls?.map((url) => (
                  <div key={url.id} className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-400 truncate">{url?.targetUrl}</p>
                        <p className="text-sm font-medium text-indigo-400">
                          {BASE_URL}/{url.shortCode}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {url?.clicks || 0} clicks
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyToClipboard(`${BASE_URL}/${url?.shortCode}`)}
                          className="inline-flex items-center px-3 py-1 border border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </button>
                        <a
                          href={`${BASE_URL}/${url?.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 border border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Visit
                        </a>
                        <button
                          onClick={() => handleDelete(url?.id)}
                          className="inline-flex items-center px-3 py-1 border border-red-600 shadow-sm text-sm leading-4 font-medium rounded-md text-red-300 bg-gray-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;