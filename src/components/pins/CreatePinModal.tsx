import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  X, 
  Upload, 
  Tag, 
  MapPin, 
  DollarSign, 
  Clock, 
  Info, 
  Save 
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { RootState, AppDispatch } from '../../store';
import { toggleCreatePinModal } from '../../store/slices/uiSlice';
import { createPin } from '../../store/slices/pinsSlice';
import { FilterCategory } from '../../types';

const CreatePinModal: React.FC = () => {
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading, error } = useSelector((state: RootState) => state.pins);
  const dispatch = useDispatch<AppDispatch>();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [currentService, setCurrentService] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [category, setCategory] = useState<FilterCategory>('all');
  const [location, setLocation] = useState('');
  const [rate, setRate] = useState('');
  const [availability, setAvailability] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Categories for selection
  const categories: { id: FilterCategory; name: string }[] = [
    { id: 'all', name: 'General' },
    { id: 'tech', name: 'Tech & Development' },
    { id: 'design', name: 'Design & Creative' },
    { id: 'marketing', name: 'Marketing & Growth' },
    { id: 'finance', name: 'Finance & Strategy' },
    { id: 'leadership', name: 'Leadership & Coaching' }
  ];
  
  // Image upload handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear any image error
      setFormErrors(prev => ({ ...prev, image: '' }));
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880, // 5MB
    maxFiles: 1
  });
  
  const handleClose = () => {
    dispatch(toggleCreatePinModal());
  };
  
  const handleAddService = () => {
    if (currentService.trim() && !services.includes(currentService.trim())) {
      setServices([...services, currentService.trim()]);
      setCurrentService('');
    }
  };
  
  const handleRemoveService = (service: string) => {
    setServices(services.filter(s => s !== service));
  };
  
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!imageFile) {
      errors.image = 'Image is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user || !imageFile) {
      return;
    }
    
    const pinData = {
      title,
      description,
      services,
      tags,
      category,
      location,
      rate,
      availability,
      ownerId: user.uid,
      ownerName: user.displayName || 'User',
      ownerPhoto: user.photoURL || undefined,
    };
    
    const result = await dispatch(createPin({ 
      pinData: pinData as any, 
      imageFile 
    }));
    
    if (createPin.fulfilled.match(result)) {
      dispatch(toggleCreatePinModal());
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={handleClose}
        ></div>
        
        <span 
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        
        <div 
          className={`inline-block align-bottom ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} px-4 py-3 border-b flex justify-between items-center`}>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Create Pin
            </h3>
            <button
              onClick={handleClose}
              className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Image Upload */}
              <div>
                <div 
                  {...getRootProps()} 
                  className={`
                    border-2 border-dashed rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer
                    ${isDragActive 
                      ? `${darkMode ? 'border-indigo-500 bg-indigo-900/10' : 'border-indigo-500 bg-indigo-50'}`
                      : `${darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'}`
                    }
                    ${formErrors.image ? `${darkMode ? 'border-red-600' : 'border-red-500'}` : ''}
                  `}
                >
                  <input {...getInputProps()} />
                  
                  {imagePreview ? (
                    <div className="relative w-full h-full p-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-4 right-4 p-1 bg-gray-800 text-white rounded-full opacity-70 hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <Upload className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
                      </p>
                      <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        or click to browse (max 5MB)
                      </p>
                      {formErrors.image && (
                        <p className="mt-2 text-red-500 dark:text-red-400">{formErrors.image}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column - Pin Details */}
              <div>
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Product Designer with 5+ years experience"
                    className={`w-full px-3 py-2 rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } border ${formErrors.title ? 'border-red-500 dark:border-red-600' : ''} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.title}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a detailed description about your professional services, expertise, or what you're looking for..."
                    rows={3}
                    className={`w-full px-3 py-2 rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="New York, NY or Remote"
                      className={`w-full px-3 py-2 rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Rate
                    </label>
                    <input
                      type="text"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      placeholder="$50/hr or Fixed Price"
                      className={`w-full px-3 py-2 rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Clock className="w-4 h-4 inline mr-1" />
                    Availability
                  </label>
                  <input
                    type="text"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    placeholder="Available Now, 2 weeks notice, etc."
                    className={`w-full px-3 py-2 rounded-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Services Offered
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={currentService}
                    onChange={(e) => setCurrentService(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddService();
                      }
                    }}
                    placeholder="UI/UX Design"
                    className={`flex-grow px-3 py-2 rounded-l-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                {services.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {services.map((service, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          darkMode 
                            ? 'bg-indigo-900 text-indigo-200'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {service}
                        <button
                          type="button"
                          onClick={() => handleRemoveService(service)}
                          className="ml-2 focus:outline-none"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Tag className="w-4 h-4 inline mr-1" />
                  Tags
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="design, react, leadership"
                    className={`flex-grow px-3 py-2 rounded-l-md ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 focus:outline-none"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FilterCategory)}
                className={`w-full px-3 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            {/* Error message from Redux store */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-md">
                <div className="flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  <p>{error}</p>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className={`px-4 py-2 mr-3 border ${
                  darkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } rounded-md`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-70 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Pin
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePinModal;