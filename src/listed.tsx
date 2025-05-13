import React, { useState } from 'react';
import { Search, Heart, Bookmark, Share2, MapPin, DollarSign, Star, Clock } from 'lucide-react';

// Define talent interface
interface Talent {
  id: number;
  name: string;
  title: string;
  services: string[];
  rate: string;
  location: string;
  availability: string;
  rating: number;
  image: string;
  coverImage: string;
  verified: boolean;
  tags: string[];
  pins: number;
  booked: number;
}

const Listed: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);

  // Mock talent data
  const [talents] = useState<Talent[]>([
    {
      id: 1,
      name: "Aisha Johnson",
      title: "Product Designer",
      services: ["UI/UX Design", "Brand Strategy", "Workshop Facilitation"],
      rate: "150/hr",
      location: "Atlanta, GA",
      availability: "Available Now",
      rating: 4.9,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AishaJohnson&backgroundColor=b6e3f4,c0aede,d1d4f9&skinColor=9e5622,6f4a2f,4a2511",
      coverImage: "https://source.unsplash.com/random/300x200?design",
      verified: true,
      tags: ["design", "strategy", "leadership"],
      pins: 234,
      booked: 89
    },
    {
      id: 2,
      name: "Maya Williams",
      title: "Data Scientist",
      services: ["Machine Learning", "Data Analytics", "Consulting"],
      rate: "200/hr",
      location: "Chicago, IL",
      availability: "2 weeks",
      rating: 5.0,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=MayaWilliams&backgroundColor=ffd5dc,ffdfbf,d1d4f9&skinColor=9e5622,6f4a2f,4a2511",
      coverImage: "https://source.unsplash.com/random/300x200?data",
      verified: true,
      tags: ["tech", "analytics", "AI"],
      pins: 567,
      booked: 134
    },
    {
      id: 3,
      name: "Zara Thompson",
      title: "Marketing Strategist",
      services: ["Content Strategy", "Social Media", "Brand Development"],
      rate: "125/hr",
      location: "Remote",
      availability: "Available Now",
      rating: 4.8,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZaraThompson&backgroundColor=b6e3f4,c0aede,ffdfbf&skinColor=9e5622,6f4a2f,4a2511",
      coverImage: "https://source.unsplash.com/random/300x200?marketing",
      verified: true,
      tags: ["marketing", "content", "strategy"],
      pins: 345,
      booked: 67
    },
    {
      id: 4,
      name: "Jasmine Davis",
      title: "Full Stack Developer",
      services: ["Web Development", "API Design", "Tech Consulting"],
      rate: "175/hr",
      location: "New York, NY",
      availability: "1 week",
      rating: 4.9,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=JasmineDavis&backgroundColor=ffd5dc,c0aede,d1d4f9&skinColor=9e5622,6f4a2f,4a2511",
      coverImage: "https://source.unsplash.com/random/300x200?coding",
      verified: true,
      tags: ["development", "tech", "consulting"],
      pins: 892,
      booked: 201
    },
    {
      id: 5,
      name: "Nia Roberts",
      title: "Financial Consultant",
      services: ["Financial Planning", "Investment Strategy", "Business Finance"],
      rate: "225/hr",
      location: "Houston, TX",
      availability: "Available Now",
      rating: 5.0,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=NiaRoberts&backgroundColor=b6e3f4,ffdfbf,ffd5dc&skinColor=9e5622,6f4a2f,4a2511",
      coverImage: "https://source.unsplash.com/random/300x200?finance",
      verified: true,
      tags: ["finance", "strategy", "consulting"],
      pins: 412,
      booked: 156
    },
    {
      id: 6,
      name: "Kamala Brown",
      title: "Executive Coach",
      services: ["Leadership Coaching", "Team Building", "Strategic Planning"],
      rate: "300/hr",
      location: "Los Angeles, CA",
      availability: "3 weeks",
      rating: 4.9,
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=KamalaBrown&backgroundColor=c0aede,ffd5dc,ffdfbf&skinColor=9e5622,6f4a2f,4a2511",
      coverImage: "https://source.unsplash.com/random/300x200?leadership",
      verified: true,
      tags: ["leadership", "coaching", "strategy"],
      pins: 623,
      booked: 89
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Talent', icon: '🌟' },
    { id: 'tech', name: 'Tech & Development', icon: '💻' },
    { id: 'design', name: 'Design & Creative', icon: '🎨' },
    { id: 'marketing', name: 'Marketing & Growth', icon: '📈' },
    { id: 'finance', name: 'Finance & Strategy', icon: '💰' },
    { id: 'leadership', name: 'Leadership & Coaching', icon: '🚀' }
  ];

  const filteredTalents = talents.filter(talent => {
    const matchesSearch = talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         talent.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = selectedFilter === 'all' || talent.tags.includes(selectedFilter);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">Listed</h1>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search talent, skills, services..."
                  className="pl-10 pr-4 py-2 w-96 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-700 hover:text-gray-900">Browse</button>
              <button className="px-4 py-2 text-gray-700 hover:text-gray-900">Boards</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700">
                Post Service
              </button>
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-6 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedFilter(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedFilter === category.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTalents.map(talent => (
            <div
              key={talent.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTalent(talent)}
            >
              {/* Cover Image */}
              <div className="relative h-32">
                <img
                  src={talent.coverImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button className="p-1.5 bg-white rounded-full shadow-sm hover:shadow-md">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1.5 bg-white rounded-full shadow-sm hover:shadow-md">
                    <Bookmark className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Profile Section */}
              <div className="relative px-4 pb-4">
                <div className="absolute -top-12 left-4">
                  <img
                    src={talent.image}
                    alt={talent.name}
                    className="w-24 h-24 rounded-full border-4 border-white object-contain bg-white"
                  />
                </div>

                <div className="pt-14">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{talent.name}</h3>
                      <p className="text-sm text-gray-600">{talent.title}</p>
                    </div>
                    {talent.verified && (
                      <div className="bg-indigo-100 p-1 rounded-full">
                        <Star className="w-3 h-3 text-indigo-600" />
                      </div>
                    )}
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {talent.services.slice(0, 2).map((service, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                      {talent.services.length > 2 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          +{talent.services.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {talent.rate}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-3 h-3 mr-1" />
                        {talent.availability}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        {talent.location}
                      </div>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {talent.rating}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>{talent.pins} pins</span>
                    <span>{talent.booked} bookings</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTalent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Talent Profile</h2>
              <button
                onClick={() => setSelectedTalent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={selectedTalent.image}
                  alt={selectedTalent.name}
                  className="w-32 h-32 rounded-full object-contain bg-gray-100"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold">{selectedTalent.name}</h3>
                  <p className="text-gray-600">{selectedTalent.title}</p>

                  <div className="mt-4 flex items-center space-x-4">
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700">
                      Book Now
                    </button>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50">
                      Pin to Board
                    </button>
                    <button className="p-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Services Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTalent.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>{selectedTalent.rate}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{selectedTalent.availability}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{selectedTalent.location}</span>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 mr-2 fill-current" />
                      <span>{selectedTalent.rating} rating</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Stats</h4>
                  <div className="flex items-center space-x-6 text-gray-600">
                    <span>{selectedTalent.pins} people pinned this</span>
                    <span>{selectedTalent.booked} successful bookings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listed;
