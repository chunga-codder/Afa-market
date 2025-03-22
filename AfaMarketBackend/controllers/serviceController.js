const { serviceCategories } = require('../models/Service');
const User = require('../models/User');
const Service = require('../models/Service');

// 🟢 Create a New Service
const createService = async (req, res) => {
  try {
    // Get user from database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Destructure the data from the request
    const { title, description, price, category, location, hasTransportVehicle, agent } = req.body;

    // Check if the selected location matches the user's location
    if (user.location !== location) {
      return res.status(400).json({ success: false, message: 'You can only select your own location for services.' });
    }

    // Check if House Moving or Transportation is selected, ensure transport vehicle info is provided
    if (['House Moving and Transfer Assistant', 'Transportation'].includes(category) && hasTransportVehicle === undefined) {
      return res.status(400).json({ success: false, message: 'Please specify if you have a transport vehicle.' });
    }

    //  Create the new service
    const service = new Service({
      title,
      description,
      price,
      category,
      provider: req.user.id, // Logged-in user is the provider
      location,
      hasTransportVehicle: hasTransportVehicle || false,
      agent: agent || null
    });

    await service.save();
    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Service creation failed', error: error.message });
  }
};

// 🔵 Get All Services
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).populate('provider agent', 'name email');
    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch services', error: error.message });
  }
};

// 🟡 Get a Single Service
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider agent', 'name email');
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    res.status(200).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching service', error: error.message });
  }
};

// 🟠 Update Service (Only Provider)
const updateService = async (req, res) => {
  try {
    const { title, description, price, category, location, isActive, agent, hasTransportVehicle } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service || service.provider.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update' });
    }

    service.title = title || service.title;
    service.description = description || service.description;
    service.price = price || service.price;
    service.category = category || service.category;
    service.location = location || service.location;
    service.isActive = isActive !== undefined ? isActive : service.isActive;
    service.agent = agent || service.agent;
    service.hasTransportVehicle = hasTransportVehicle !== undefined ? hasTransportVehicle : service.hasTransportVehicle;

    await service.save();
    res.status(200).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

// 🔴 Delete Service (Only Provider)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service || service.provider.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete' });
    }

    await Service.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete service', error: error.message });
  }
};


// 🟡 Get predefined service categories
const getServiceCategories = (req, res) => {
  try {
    const categories = ['House Moving and Transfer Assistant', 'Transportation', 'Cleaning Services', 'Food Delivery']; // Define your categories here
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching categories', error: error.message });
  }
};

// The other functions remain the same...

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getServiceCategories
};

